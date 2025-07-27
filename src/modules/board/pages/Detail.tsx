import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IonContent } from "@ionic/react";
import { useParams } from "react-router";

import { FullTreatmentFragment } from "@graphql_generated/fullTreatment.generated";

import { useUserContext } from "@contexts";
import { SpecialIconName, SpecialIcon, Image2x } from "@components";
import { treatmentsColors } from "@utils";
import { $color, $uw } from "@theme";
import { FullReportFragment, useGetReportLazyQuery } from "@types";
import dayjs from "dayjs";

type props = {};

export const ReportDetails: React.FC<props> = () => {
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<FullReportFragment>();
    const { setPage } = useUserContext();

    const { t } = useTranslation();
    const [getEvent, { loading }] = useGetReportLazyQuery({
        onCompleted: ({ getReport }) => {
			console.log(getReport)
            if (!getReport?.report || getReport.error) {
                return;
            }
            setReport(getReport.report);
        },
    });
    useEffect(() => {
        setPage({ visible: true, name: "" });
        getEvent({ variables: { id } });
    }, []);

	useEffect(()=>{
		console.log(report)
		if(report){
			if(report?.pet){
				setPage({name: t('board.detail.missing', {name: report.pet.name})})
				return
			}
			setPage({name: t('board.detail.found', {date: dayjs(report.date).format("LLL")})})
		}
	}, [report])

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
        <IonContent>
            <MainPicture>
                {mainPicture && <Image2x id={mainPicture} />}
            </MainPicture>
            <Body>
                <Info>
                    {report?.medias && report.medias.length > 0 && (
                        <Gallery>
                            {report.medias.map((media) => (
                                <GalleryItem>
                                    <Image2x id={media?.id ?? ""} />
                                </GalleryItem>
                            ))}
                        </Gallery>
                    )}
                </Info>
            </Body>
        </IonContent>
    );
};

const MainPicture = styled.div`
    width: 100%;
    aspect-ratio: 1;
`;

const Body = styled.div`
    width: 100%;
    height: calc(100dvh - ${$uw(12)});
    background-color: ${$color("light")};
    overflow-y: scroll;
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
`;

const GalleryItem = styled.div`
    width: calc(50% - ${$uw(0.5)});
    aspect-ratio: 1;
	margin-bottom: ${$uw(1)};
`;
