import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { IonContent } from "@ionic/react";
import { useHistory, useLocation, useParams } from "react-router";

import { useUserContext } from "@contexts";
import { $color, $cssTRBL, $uw } from "@theme";
import styled from "styled-components";
import {
    DateTimePicker,
    FakeInput,
    Icon,
    Image2x,
    Modal,
    Option,
    SelectInput,
    SubmitInput,
    TextAreaInput,
    TextInput,
    Toggle,
} from "@components";
import { FormProvider, useForm } from "react-hook-form";
import { DashboardPetFragment, MutationCreateReportArgs, ReportType, useCreateReportMutation } from "@types";
import { useQueryParams } from "@hooks";
import { LocationSelector } from "../components";
import toast from "react-hot-toast";

type props = {};
type Location = {
    coordinates: { latitude: number; longitude: number };
    label: string;
};

export const NewReport: React.FC<props> = () => {
    const [useCurrentDate, setUseCurrentDate] = useState(true);
    const [isMissing, setIsMissing] = useState(false);
    const queryParams = useQueryParams();
    const { setPage, fadeBackground, ownedPets, user } = useUserContext();
    const [inited, setInited] = useState(false);
    const { t } = useTranslation();
    const history = useHistory()
    const [openLocationSelector, setOpenLocationSelector] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
        null
    );
    const [locationText, setLocationText] = useState("");

    const petsOptions: Option[] = ownedPets.map((pet: DashboardPetFragment) => {
        return {
            value: pet.id,
            label: pet.name,
            render: (
                <MinPet>
                    {
                        <MinImageWrapper
                            color={pet.main_picture?.main_color?.color}
                            className="custom-pet-border-color"
                        >
                            {pet.main_picture?.id && (
                                <Image2x rounded id={pet.main_picture.id} />
                            )}
                        </MinImageWrapper>
                    }
                    <p>{pet.name}</p>
                </MinPet>
            ),
        };
    });

    
    const [createReport, {loading}] = useCreateReportMutation({
        onCompleted:({createReport})=>{
            if(createReport.error || !createReport.report?.id ) {
                toast.error(t('board.new_report.save_error'));
                return
            }

            toast.success(t('board.new_report.save_success'));
            setTimeout(()=>{
                history.push('/board');
            }, 1500)
        }
    })

    const methods = useForm<
         {
            notes: string;
            location: string;
            date_date: string;
            date_time: string;
            pet_id: string;
        }
    >({
        mode: "onSubmit",
    });

    const checkDefualt = useCallback(() => {
        const defaultPet = petsOptions.find(
            (pet) => queryParams.get("pet_id") == pet.value
        )?.value;
        if (defaultPet) {
            methods.setValue("pet_id", defaultPet);
            setIsMissing(true);
        }
    }, [ownedPets, queryParams]);

    useEffect(() => {
        setPage({ visible: true, name: t("board.new_report.page_name") });
        setInited(true);
    }, []);

    useEffect(() => {
        checkDefualt();        
    }, [ownedPets]);

    const openLocationsModal = useCallback(() => {
        setOpenLocationSelector(true);
        fadeBackground(true);
    }, [locationText, selectedLocation, openLocationSelector]);


    useEffect(()=>{
        if(!inited) return;
        if(!isMissing ){
            methods.clearErrors("pet_id")
            methods.setValue('pet_id', "")
        }
    }, [isMissing, inited])
    useEffect(()=>{
        if(!inited) return;
        if(useCurrentDate ){
            methods.clearErrors("date_date")
            methods.clearErrors("date_time")
            methods.setValue("date_date", "")
            methods.setValue("date_time", "")

        }
    }, [useCurrentDate, inited])

    return (
        <IonContent fullscreen>
            {openLocationSelector && (
                <Modal
                    open={openLocationSelector}
                    onClose={() => {
                        setOpenLocationSelector(false);
                        fadeBackground(false);
                    }}
                   
                >
                    <LocationSelector
                        onSelected={(v) => {
                            console.log("*é*é*é*é*é*é", v);
                            setSelectedLocation(v);
                            // if (!v) return;
                            setLocationText(v?.label ?? "");
                            console.log("Selected location:", v);
                            setOpenLocationSelector(false);
                        }}
                        onCancel={() => {
                            setOpenLocationSelector(false);
                            fadeBackground(false);
                        }}
                        changeLocationText={(v) => setLocationText(v)}
                        selectedLocation={selectedLocation}
                    />
                </Modal>
            )}

            <FormProvider {...methods}>
                <Form
                    onSubmit={
                        methods.handleSubmit((data)=>{
                            if(!selectedLocation ) return
                            createReport({variables: {
                                data: {
                                    pet_id: isMissing ? data.pet_id : undefined,
                                    type: isMissing ? ReportType.Missing : ReportType.Found,
                                    latitude: selectedLocation.coordinates.latitude,
                                    longitude: selectedLocation.coordinates.longitude,
                                    place: selectedLocation.label,
                                    reporter: {
                                        email: user.email,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        user_id: user.id
                                    }
                                }
                            }})
                        })
                    }
                >
                    <Row>
                        <p>{t("board.new_report.is_missing")}</p>
                        <Toggle
                            value={isMissing}
                            onChange={(v) => setIsMissing(v)}
                        />
                    </Row>
                    <SelectInput
                        name="pet_id"
                        options={petsOptions}
                        required={isMissing}
                        disabled={!isMissing}
                        textLabel="board.new_report.pet"
                    />
                    {/* <TextInput name="test" required /> */}

                    <FakeInput
                        name="location"
                        required
                        textLabel="board.new_report.insert_location"
                        onClick={openLocationsModal}
                        value={locationText}
                        rightElement={locationText.length > 0 && <Icon onClick={()=>{  setSelectedLocation(null); setLocationText("")}} name="closeCircleOutline" />}
                    />
                    <Row>
                        <p>{t("board.new_report.use_current_time")}</p>
                        <Toggle
                            value={useCurrentDate}
                            onChange={(v) => setUseCurrentDate(v)}
                        />
                    </Row>
                    <DateTimePicker
                        name="date_date"
                        textLabel="board.new_report.date"
                        type="date"
                        className="main_date"
                        disabled={useCurrentDate}
                        required={!useCurrentDate}
                    />

                    <DateTimePicker
                        name="date_time"
                        textLabel="board.new_report.time"
                        type="time"
                        className="main_time"
                        required={!useCurrentDate}
                        disabled={useCurrentDate}
                    />
                    <TextAreaInput
                        name="notes"
                        required
                        textLabel="board.new_report.notes"
                    />

                    <SubmitInput submitting={loading}  color="primary"   >
                        {t('board.new_report.save')}
                    </SubmitInput>
                </Form>
            </FormProvider>
        </IonContent>
    );
};

const Form = styled.form`
    width: 100%;
    display: flex;
    padding: ${$cssTRBL(2, 1)};
    flex-wrap: wrap;
    height: calc(100dvh - ${$uw(12)});
    justify-content: space-between;
    .main_date {
        width: 55%;
    }
    .main_time {
        width: 40%;
    }
    .submit-input{
        align-self: flex-end;
        width: 100%;
    }
`;

const Row = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${$uw(2.5)};
`;

const MinPet = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: ${$uw(1)};
    padding-left: ${$uw(1)};
`;

const MinImageWrapper = styled.div<{ color?: string }>`
    width: ${$uw(2.3)};
    height: ${$uw(2.3)};
    border-radius: 100%;
    border: 2px solid ${({ color }) => $color(color || "primary")};
`;
