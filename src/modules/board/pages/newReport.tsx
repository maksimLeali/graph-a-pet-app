import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { IonButton, IonContent } from "@ionic/react";
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
    Toggle, PullToRefresh } from "@components";
import { FormProvider, useForm } from "react-hook-form";
import {
    DashboardPetFragment,
    MutationCreateReportArgs,
    ReportType,
    useCreateMediaMutation,
    useCreateReportMutation,
} from "@types";
import { useQueryParams } from "@hooks";
import { LocationSelector } from "../components";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import axios from "axios";

type props = {};
type Location = {
    coordinates: { latitude: number; longitude: number };
    label: string;
};

export const NewReport: React.FC<props> = () => {
    const [useCurrentDate, setUseCurrentDate] = useState(true);
    const [isMissing, setIsMissing] = useState(false);
    const [disclaimerSeen, setDisclaimerSeen] = useState(false);
    const [disclaimerOpen, setDisclaimerOpen] = useState(false);
    const queryParams = useQueryParams();
    const { setPage, fadeBackground, ownedPets, user } = useUserContext();
    const [inited, setInited] = useState(false);
    const { t } = useTranslation();
    const [loadingCreate, setLoadingCreate] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [pictures, setPictures] = useState<{ url: string; type: string }[]>(
        []
    );
    const history = useHistory();
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

    const [createReport, { loading }] = useCreateReportMutation({
        onCompleted: async ({ createReport }) => {
            if (createReport.error || !createReport.report?.id) {
                toast.error(t("board.new_report.save_error"));
                return;
            }

            if (pictures) {
                await handlesUploadPictures(pictures, createReport.report.id);
            }
            setLoadingCreate(false)
            toast.success(t("board.new_report.save_success"));
            setTimeout(() => {
                history.push("/board");
            }, 1500);
        },
    });

    const [createMedia] = useCreateMediaMutation();

    const methods = useForm<{
        notes: string;
        location: string;
        date_date: string;
        date_time: string;
        pet_id: string;
    }>({
        mode: "onSubmit",
    });

    const handleUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target?.files;
        const temp: { url: string; type: string }[] = [];
        if (!files) return;
        for (const file of files) {
            if (file) {
                const tempImageURL = URL.createObjectURL(file);
                temp.push({ url: tempImageURL, type: file.type });
            }
        }
        console.log("pictures", temp.length);
        setPictures((p) => [...p, ...temp]);
    }, []);

    const uploadImage = async (
        image: { url: string; type: string },
        id: string,
        index: number
    ) => {
        try {
            // Convert base64 URL to Blob
            const response = await fetch(image.url);
            const blob = await response.blob();

            // Prepare FormData
            const formData = new FormData();
            formData.append("file", blob, `${id}_${index}.png`);
            formData.append("disable_colors", "true");
            // API Call
            const apiResponse = await axios.post(
                `${import.meta.env.VITE_MEDIA_URL}/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "User-Agent": "insomnia/8.6.1",
                    },
                }
            );
            const mediaData = apiResponse.data;
            createMedia({
                variables: {
                    data: {
                        type: image.type,
                        scope: "report_medias",
                        ref_id: id,
                        main_colors: [],
                        url: mediaData.public_url,
                    },
                },
            });
            console.log("Upload Success:", apiResponse.data);
        } catch (error) {
            console.error("Upload Error:", error);
        }
    };

    const handlesUploadPictures = useCallback(
        async (images: { url: string; type: string }[], report_id: string) => {
            await Promise.all(
                images.map(async (image, i) => {
                    await uploadImage(image, report_id, i);
                })
            );
        },
        []
    );

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

    useEffect(() => {
        if (!inited) return;
        if (!isMissing) {
            methods.clearErrors("pet_id");
            methods.setValue("pet_id", "");
        }
    }, [isMissing, inited]);
    useEffect(() => {
        if (!inited) return;
        if (useCurrentDate) {
            methods.clearErrors("date_date");
            methods.clearErrors("date_time");
            methods.setValue("date_date", "");
            methods.setValue("date_time", "");
        }
    }, [useCurrentDate, inited]);

    useEffect(() => {
        if (disclaimerSeen) return;
        setDisclaimerOpen(isMissing);
    }, [disclaimerSeen, isMissing]);

    return (
        <IonContent fullscreen>
            <PullToRefresh />
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
                            setSelectedLocation(v);
                            setLocationText(v?.label ?? "");
                            fadeBackground(false);
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
                    onSubmit={methods.handleSubmit((data) => {
                        if (!selectedLocation) return;
                        let date = undefined;
                        if (!useCurrentDate) {
                            const time = dayjs(data.date_time);
                            date = dayjs(data.date_date)
                                .set("hour", time.hour())
                                .set("minute", time.minute())
                                .toISOString();
                        }
                        setLoadingCreate(true);
                        createReport({
                            variables: {
                                data: {
                                    pet_id: isMissing ? data.pet_id : undefined,
                                    type: isMissing
                                        ? ReportType.Missing
                                        : ReportType.Found,
                                    latitude:
                                        selectedLocation.coordinates.latitude,
                                    longitude:
                                        selectedLocation.coordinates.longitude,
                                    place: selectedLocation.label,
                                    date,
                                    notes:
                                        data.notes && data.notes.length > 0
                                            ? [data.notes]
                                            : undefined,
                                    reporter: {
                                        email: user.email,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        user_id: user.id,
                                    },
                                },
                            },
                        });
                    })}
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
                        rightElement={
                            locationText.length > 0 && (
                                <Icon
                                    onClick={() => {
                                        setSelectedLocation(null);
                                        setLocationText("");
                                    }}
                                    name="closeCircleOutline"
                                />
                            )
                        }
                    />
                    <Row>
                        <p>{t("board.new_report.use_current_time")}</p>
                        <Toggle
                            value={useCurrentDate}
                            onChange={(v) => setUseCurrentDate(v)}
                        />
                    </Row>
                    <Row>
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
                    </Row>
                    <TextAreaInput
                        name="notes"
                        required
                        textLabel="board.new_report.notes"
                    />
                    <IconWrapper
                        onClick={(e) => {
                            console.log("click");
                            inputRef.current?.click();
                        }}
                    >
                        <input
                            ref={inputRef}
                            style={{ display: "none" }}
                            type="file"
                            accept="image/*;capture=camera"
                            multiple
                            onChange={(e) => handleUpload(e)}
                        />
                        <Icon name="cameraOutline" color="white" />
                        <span>{t("board.new_report.add_pictures")}</span>
                    </IconWrapper>
                    {pictures.length > 0 && (
                        <PicturesContainer>
                            {pictures.map((picture, i) => (
                                <Picture src={picture.url} key={i} />
                            ))}
                        </PicturesContainer>
                    )}
                    <SubmitInput submitting={loadingCreate} color="primary">
                        {t("board.new_report.save")}
                    </SubmitInput>
                    {disclaimerOpen && (
                        <Disclaimer>
                            <Icon
                                onClick={() => {
                                    setDisclaimerSeen(true);
                                    setDisclaimerOpen(false);
                                }}
                                className="closeDisclaimer"
                                name="close"
                            ></Icon>
                            <Title>
                                <Icon
                                    color="danger"
                                    name="alertCircleOutline"
                                />{" "}
                                {t("board.new_report.disclaimer_title")}
                            </Title>
                            <Body
                                dangerouslySetInnerHTML={{
                                    __html:
                                        t(
                                            "board.new_report.disclaimer_body_1"
                                        ) ?? "",
                                }}
                            />
                            <Body
                                dangerouslySetInnerHTML={{
                                    __html:
                                        t(
                                            "board.new_report.disclaimer_body_2"
                                        ) ?? "",
                                }}
                            />
                            <IonButton                                
                                onClick={() => {
                                    setDisclaimerSeen(true);
                                    setDisclaimerOpen(false);
                                }}
                            >
                                {t("board.new_report.understood")}
                            </IonButton>
                        </Disclaimer>
                    )}
                </Form>
            </FormProvider>
        </IonContent>
    );
};

const Form = styled.form`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: ${$cssTRBL(2, 1)};
    flex-wrap: wrap;

    justify-content: flex-start;
    .main_date {
        width: 55%;
    }
    .main_time {
        width: 40%;
    }
    .main_date,
    .main_time {
        margin-bottom: 0;
    }
    .submit-input {
        z-index: 2;

        position: fixed;
        width: ${$uw(28)};
        left: calc(50% - ${$uw(14)});
        bottom: ${$uw(7)};
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

const IconWrapper = styled.div`
    display: flex;

    width: fit-content;
    padding: ${$cssTRBL(1)};
    align-items: center;
    gap: ${$uw(1)};
    border-radius: 10px;
    background-color: ${$color("primary-light")};
    > .icon {
        height: 100%;
        aspect-ratio: 1;
    }
    margin-bottom: ${$uw(2)};
`;

const Disclaimer = styled.div`
    background-color: ${$color("light")};

    position: fixed;
    width: ${$uw(30)};
    left: calc(50% - ${$uw(15)});
    bottom: ${$uw(7)};
    border-radius: 4px;
    padding: ${$cssTRBL(2)};
    z-index: 99;
    display: flex;
    flex-direction: column;
    .closeDisclaimer {
        position: absolute;
        right: ${$uw(2)};
        top: ${$uw(1)};
    }
    > .button {
        margin-left: auto;
    }
`;

const Title = styled.h3`
    display: flex;
    gap: ${$uw(1)};
    margin-bottom: ${$uw(1)};
`;

const Body = styled.p`
    width: 100%;
    margin-bottom: ${$uw(1)};
`;

const PicturesContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: ${$uw(2)};
`;

const Picture = styled.img`
    width: calc(50% - ${$uw(0.5)});
    flex: 0 0 calc(50% - ${$uw(0.5)});
    aspect-ratio: 1;
    margin-bottom: ${$uw(1)};
    object-fit: cover;
`;
