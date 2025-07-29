import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IonContent } from "@ionic/react";
import { useParams } from "react-router";

import { FullTreatmentFragment } from "@graphql_generated/fullTreatment.generated";

import { useUserContext } from "@contexts";
import { SpecialIconName, SpecialIcon, Image2x } from "@components";
import { treatmentsColors } from "@utils";
import { $color, $cssTRBL, $uw } from "@theme";
import { FullReportFragment, Gender, useGetReportLazyQuery } from "@types";
import dayjs from "dayjs";

type props = {};

export const ReportDetails: React.FC<props> = () => {
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<FullReportFragment>();
    const { setPage } = useUserContext();
    const { t } = useTranslation();
    const [getEvent, { loading }] = useGetReportLazyQuery({
        onCompleted: ({ getReport }) => {
            console.log(getReport);
            if (!getReport?.report || getReport.error) {
                return;
            }
            setReport(getReport.report);
        },
    });
    useEffect(() => {
        setPage({ visible: true, noScroll: true, name: "" });
        getEvent({ variables: { id } });
    }, []);

    useEffect(() => {
        console.log(report);
        if (report) {
            if (report?.pet) {
                setPage({
                    visible: true,
                    noScroll: true,
                    name: t("board.detail.missing", { name: report.pet.name }),
                });
                return;
            }
            setPage({
                visible: true,
                noScroll: true,
                name: t("board.detail.found", {
                    date: dayjs(report.date).format("LLL"),
                }),
            });
        }
    }, [report]);

    const mainPicture = useMemo(() => {
        if (report?.pet?.main_picture?.id) {
            return report.pet.main_picture.id;
        }
        if (report?.medias && report.medias.length > 0) {
            return report.medias[0]?.id;
        }
        return null;
    }, [report]);

    return (
        <CustomIonContent fullscreen>
            <Container>
                <MainPicture>
                    {mainPicture && <Image2x id={mainPicture} />}
                </MainPicture>
                <BodyContainer>
                    <Body>
                        {report && (
                            <Info>
                                <Row>
                                    <p>{t("board.detail.date")}</p>
                                    <p>{dayjs(report.date).format("lll")}</p>
                                </Row>
                                <Row>
                                    <p>{t("board.detail.place")}</p>
                                    <p>{report.place}</p>
                                </Row>
                                {report.pet ? (
                                    <>
                                        <Row>
                                            <p>{t("board.detail.pet_name")}</p>
                                            <p>{report.pet.name}</p>
                                        </Row>
                                        <Row>
                                            <p>{t("board.detail.pet_breed")}</p>
                                            <p>{report.pet.body.breed}</p>
                                        </Row>
                                        <Row>
                                            <p>
                                                {t("board.detail.pet_gender")}
                                            </p>
                                            <p>
                                                {t(
                                                    report.pet.gender ===
                                                        Gender.Male
                                                        ? "pets.gender_male"
                                                        : report.pet.gender ===
                                                          Gender.Female
                                                        ? "pets.gender_female"
                                                        : "pets.gender_not_said"
                                                )}
                                            </p>
                                        </Row>
                                        <Row>
                                            <p>
                                                {t("board.detail.pet_weight")}
                                            </p>
                                            <p>{report.pet.weight_kg} Kg</p>
                                        </Row>
                                        <Row>
                                            <p>{t("board.detail.pet_years")}</p>
                                            <p>{report.pet.years}</p>
                                        </Row>
                                    </>
                                ) : (
                                    <></>
                                )}
                                {report.notes && report.notes.length > 0 && (
                                    <Row>
                                        <p>{t("board.detail.notes")}</p>
                                        <ul>
                                            {report.notes.map((note) => {
                                                return (
                                                    <li
                                                        dangerouslySetInnerHTML={{
                                                            __html: note ?? "",
                                                        }}
                                                    />
                                                );
                                            })}
                                        </ul>
                                    </Row>
                                )}

                                {report?.medias && report.medias.length > 0 ? (
                                    <Gallery>
                                        <GallryTitle className="title">{t("board.detail.gallery")}</GallryTitle>
                                        {report.medias.map((media) => (
                                            <GalleryItem>
                                                <Image2x id={media?.id ?? ""} />
                                            </GalleryItem>
                                        ))}
                                    </Gallery>
                                ) : (
                                    <NoImage>
                                        {t("board.detail.no_images")}
                                    </NoImage>
                                )}
                            </Info>
                        )}
                    </Body>
                </BodyContainer>
            </Container>
        </CustomIonContent>
    );
};

const CustomIonContent = styled(IonContent)`
    height: 100dvh;
    padding: 0;
    margin-bottom: ${$uw(-4)};
`;

const Container = styled.div`
    position: relative;
    height: calc(100dvh - ${$uw(5)});
    overflow-y: hidden;
`;

const MainPicture = styled.div`
    width: 100%;
    aspect-ratio: 1;
    position: absolute;
    top: 0;
`;

const BodyContainer = styled.div`
    width: 100%;
    max-height: 100%;    
    padding-top: ${$uw(30)};
    overflow-y: scroll;
    position: relative;
    z-index: 1;
`;

const Body = styled.div`
    width: 100%;
    min-height: calc(100dvh - ${$uw(30)});
    border-radius: 4px 4px 0 0;

    background-color: ${$color("light")};
`;

const Info = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Gallery = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-bottom: ${$uw(5)};
    `;

const GallryTitle = styled.h3`
    width: 100%;
    text-align: center;
    padding:${$cssTRBL(2)}; 
`
const GalleryItem = styled.div`
    width: calc(50% - ${$uw(0.5)});
    aspect-ratio: 1;
    margin-bottom: ${$uw(1)};
    
`;

const Row = styled.div`
    width: 100%;
    padding: ${$cssTRBL(1, 2)};
    border-bottom: 1px solid ${$color("dark")};
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > p:first-child {
        width: 40%;
    }
    > p:last-child {
        width: 60%;
    }
    > ul {
        width: 100%;
    }
`;

const NoImage = styled.p`
    width: 100%;
    text-align: center;
    padding: ${$uw(4)};
`;
