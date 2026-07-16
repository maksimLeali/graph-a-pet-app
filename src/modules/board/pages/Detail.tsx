import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IonContent } from "@ionic/react";
import { useParams } from "react-router";

import { FullTreatmentFragment } from "@graphql_generated/fullTreatment.generated";

import { useModal, useUserContext } from "@contexts";
import { Icon, Image2x, PullToRefresh } from "@components";
import { $color, $cssTRBL, $uw } from "@theme";
import { FullReportFragment, Gender, useGetReportLazyQuery } from "@types";
import dayjs from "dayjs";

type props = {};

export const ReportDetails: React.FC<props> = () => {
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<FullReportFragment>();
    const { setPage } = useUserContext();
    const { openModal, closeModal } = useModal();
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

    const openGalleryModal = useCallback(
        (startIndex: number) => {
            const medias = (report?.medias ?? []).filter(
                (media): media is NonNullable<typeof media> =>
                    Boolean(media?.id),
            );
            if (medias.length === 0) {
                return;
            }

            const clickedMediaId = report?.medias?.[startIndex]?.id;
            const normalizedIndex = medias.findIndex(
                (media) => media?.id === clickedMediaId,
            );
            const safeIndex = normalizedIndex >= 0 ? normalizedIndex : 0;

            openModal({
                onClose: () => closeModal(),
                
                children: (
                    <GalleryPreview
                        medias={medias.map((media) => ({ id: media?.id }))}
                        startIndex={safeIndex}
                    />
                ),
            });
        },
        [report?.medias, openModal, closeModal],
    );

    return (
        <CustomIonContent fullscreen>
            <PullToRefresh />
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
                                            <p>{report.pet.breed}</p>
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
                                                          : "pets.gender_not_said",
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
                                        {report.medias.map((media, index) => (
                                            <GalleryItem
                                                key={media?.id ?? index}
                                                onClick={() =>
                                                    openGalleryModal(index)
                                                }
                                            >
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
    padding-top: ${$uw(1)};
`;

const GalleryItem = styled.div`
    width: calc(50% - ${$uw(0.5)});
    aspect-ratio: 1;
    margin-bottom: ${$uw(1)};
    cursor: pointer;
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

type GalleryPreviewProps = {
    medias: { id?: string | null }[];
    startIndex: number;
};

const GalleryPreview: React.FC<GalleryPreviewProps> = ({
    medias,
    startIndex,
}) => {
    if (medias.length === 0) {
        return null;
    }

    const total = medias.length;
    const normalize = (value: number) => ((value % total) + total) % total;
    const [activeIndex, setActiveIndex] = useState(() => normalize(startIndex));

    const goTo = (delta: number) => {
        setActiveIndex((prev) => normalize(prev + delta));
    };

    const currentMedia = medias[activeIndex];

    return (
        <GalleryModalContent>
            <GalleryModalImage>
                {currentMedia?.id && <Image2x id={currentMedia.id} />}
            </GalleryModalImage>
            <GalleryModalCounter>
                {activeIndex + 1}/{total}
            </GalleryModalCounter>
            <GalleryModalArrow
                type="button"
                className="left"
                onClick={() => goTo(-1)}
            >
                <Icon name="chevronBackOutline" color="light" />
            </GalleryModalArrow>
            <GalleryModalArrow
                type="button"
                className="right"
                onClick={() => goTo(1)}
            >
                <Icon name="chevronForwardOutline" color="light" />
            </GalleryModalArrow>
        </GalleryModalContent>
    );
};

const GalleryModalContent = styled.div`
    position: relative;
    width: 100%;
    min-height: 70dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${$cssTRBL(2, 2, 4)};
    background-color: ${$color("light")};
`;

const GalleryModalImage = styled.div`
    width: 100%;
    height: min(70dvh, ${$uw(60)});
    max-height: 70dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    > .img2x {
        width: 100%;
        height: 100%;
    }
`;

const GalleryModalArrow = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background:${$color("dark")};
    width: ${$uw(3)};
    height: ${$uw(3)};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &.left {
        left: ${$uw(1)};
    }
    &.right {
        right: ${$uw(1)};
    }
`;

const GalleryModalCounter = styled.span`
    position: absolute;
    bottom: ${$uw(1)};
    right: ${$uw(2)};
    color: ${$color("light")};
`;
