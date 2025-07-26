import { MinReport, ReportsPreview } from "@components";
import { useUserContext } from "@contexts";
import {
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonRefresher,
    IonRefresherContent,
    RefresherEventDetail,
} from "@ionic/react";
import { $color, $cssTRBL, $uw } from "@theme";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ChoiseContainer } from "../components";
import { useListReportsLazyQuery } from "../operations/__generated__/listReports.generated";
import { ReportType } from "@types";
import { MinReportFragment } from "@graphql_generated/MinReport.generated";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Board: React.FC = () => {
    const { setPage } = useUserContext();
    const [pageMissing, setPageMissing] = useState(0);
    const [pageFound, setPageFound] = useState(0);
    const [reportsType, setReportsType] = useState<ReportType>();
    const [reachedMaxMissing, setReachedMaxMissing] = useState(false);
    const [reachedMaxFound, setReachedMaxFound] = useState(false);
    const [missingReports, setMissingReports] = useState<MinReportFragment[]>(
        []
    );
    const [foundReports, setFoundReports] = useState<MinReportFragment[]>([]);
    const PAGE_SIZE = 4;
    const { t } = useTranslation();
    const [
        listMissinggReports,
        { loading: loadingMissing, refetch: refetchMissing },
    ] = useListReportsLazyQuery({
        variables: {
            commonSearch: {
                filters: {
                    fixed: [
                        {
                            key: "type",
                            value: ReportType.Missing,
                        },
                    ],
                },
                page_size: PAGE_SIZE,
                page: pageMissing,
            },
        },
        onCompleted: ({ listReports }) => {
            if (!listReports?.items?.length || listReports.error) {
                return;
            }

            setMissingReports((p) => [
                ...p,
                ...(listReports.items as MinReportFragment[]),
            ]);
            setReachedMaxMissing(true);
        },
    });
    const [
        listFoundgReports,
        { loading: loadingFound, refetch: refetchFound },
    ] = useListReportsLazyQuery({
        variables: {
            commonSearch: {
                filters: {
                    fixed: [
                        {
                            key: "type",
                            value: ReportType.Found,
                        },
                    ],
                },
                page_size: PAGE_SIZE,
                page: pageFound,
            },
        },
        onCompleted: ({ listReports }) => {
            console.log(listReports);
            if (!listReports?.items?.length || listReports.error) {
                return;
            }
            setFoundReports((p) => [
                ...p,
                ...(listReports.items as MinReportFragment[]),
            ]);
            // setReachedMaxFound(true);
        },
    });

    const fetchRepots = useCallback(() => {
        listMissinggReports();
        listFoundgReports();
    }, [pageMissing, pageFound]);

    useEffect(() => {
        setPage({ name: t("board.page_name") });
        fetchRepots();
    }, []);

    const reportList = useMemo(() => {        
        
        return _.sortBy([...missingReports, ...foundReports], "created_at");
        

        
    }, [missingReports, foundReports]);

    const reachedMax = useMemo(() => {
        if (!reportsType) {
            return reachedMaxMissing && reachedMaxFound;
        }

        if (reportsType === ReportType.Found) return reachedMaxFound;

        return reachedMaxMissing;
    }, [reachedMaxMissing, reachedMaxFound, reportsType]);

    const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        setPageFound(0);
        setPageMissing(0);
        setMissingReports([]);
        setFoundReports([]);
        fetchRepots();
        event.detail.complete();
    };

    const handleNewData = () => {
        setPageFound((p) => p + 1);
        setPageMissing((p) => p + 1);
    };

    return (
        <IonContent fullscreen>
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <Container>
                <ChoiseContainer
                    onChange={(choise) => {
                        setReportsType(choise);
                    }}
                />
            </Container>

            {/* <InfiniteScroll
                disabled={reachedMax}
                onIonInfinite={(ev: any) => {
                    handleNewData();
                    setTimeout(() => ev.target.complete(), 500);
                }}
            > */}
                
                    <List>
                        {reportList.filter((report)=> {
                            console.log(reportsType,report.type, report.type === reportsType)
                            if(!reportsType) return true;
                            return report.type === reportsType
                        }).map((item) => (
                            <MinReport report={item} />
                        ))}
                    </List>
                    <AddReportCta to="/board/new">
                        {t("board.add_report")}
                    </AddReportCta>
                
            {/* </InfiniteScroll> */}

            {/* <ReportsPreview loading={loading} reports={reports} /> */}
        </IonContent>
    );
};

const Container = styled.div`
    position: sticky;
    top: 0;
    padding: ${$cssTRBL(2, 0)};
    background-color: ${$color("background-color")};
    z-index: 99;
`;

const List = styled(IonList)`
    width: 100%;
    background-color: ${$color("background-color")};
    padding: ${$uw(1)};
    overflow-y: scroll;
`;

const InfiniteScroll = styled(IonInfiniteScroll)`
    margin-bottom: ${$uw(3)};
`;

const AddReportCta = styled(Link)`
    width: 100%;
    display: block;
    color: ${$color("primary")};
    text-decoration: underline;
    text-align: end;
    padding: ${$cssTRBL(0, 2, 1, 2)};
`;
