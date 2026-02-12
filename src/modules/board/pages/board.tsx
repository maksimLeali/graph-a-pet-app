import { Icon, MinReport, ReportsPreview } from "@components";
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
import { ListReportsQuery, ReportType } from "@types";
import { MinReportFragment } from "@graphql_generated/MinReport.generated";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Board: React.FC = () => {
    const { setPage } = useUserContext();
    const [currentPage, setCurrentPage] = useState(0);
    
    const [reportsType, setReportsType] = useState<ReportType>();
    const [reachedMax, setReachedMax] = useState(false);
    
    const [reports, setReports] = useState<MinReportFragment[]>(
        []
    );    
    const PAGE_SIZE = 10;
    const { t } = useTranslation();



    const onCompleted = useCallback(({ listReports  } :ListReportsQuery) => {
        if (!listReports?.items?.length || listReports.error) {
            return;
        }
        const totalReports = [...reports, ...listReports.items]
        setReports((p) => [
            ...p,
            ...(listReports.items as MinReportFragment[]),
        ]);
    console.log(listReports.pagination.total_items , totalReports.length)
    console.log(listReports.pagination.total_items == totalReports.length)
    if(listReports.pagination.total_items == totalReports.length){
            setReachedMax(true)
        }
    },[reports])

    const [
        listReports,     
        {refetch}   
    ] = useListReportsLazyQuery({
        // fetchPolicy: "network-only",
        variables: {
            commonSearch: {
                order_by: "date",
                order_direction: "DESC",
                page_size: PAGE_SIZE,
                page: currentPage,
            },
        },
        onCompleted

        })

    const fetchRepots = useCallback(() => {
        listReports()        
    }, [currentPage]);

    useEffect(() => {
        setPage({ name: t("board.page_name") });
        fetchRepots();
    }, []);    

    
 

    const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
        refetch().then((res) => {
            const newItems = res.data?.listReports?.items as MinReportFragment[] || [];
            setReports(newItems);
            setCurrentPage(0); // resetta anche la pagina
            event.detail.complete();            
        });
    };

    const handleNewData = useCallback(() => {
        console.log(reachedMax)
        if(!reachedMax){

            setCurrentPage((p) => p + 1);
        }
    }, [reachedMax]);

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

            <InfiniteScroll
                // disabled={reachedMax}
                onIonInfinite={(ev: any) => {
                    handleNewData();
                    setTimeout(() => ev.target.complete(), 1000);
                }}
            >
                <List>
                    {reports
                        .filter((report) => {                       
                            if (!reportsType) return true;
                            return report.type === reportsType;
                        })
                        .map((item) => (
                            <MinReport key={item.id} report={item} />
                        ))}
                </List>
                <AddReportCta to="/board/new">
                        <Icon size={$uw(2.5)} name="addCircleOutline" />                  
                </AddReportCta>
            </InfiniteScroll>

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
    color: ${$color("primary")};
    text-decoration: underline;
    text-align: end;
    padding: ${$cssTRBL(.5)};
    position: fixed;
    justify-self: end;
    align-items: center;
    bottom:${$uw(7)};
    width: fit-content;
    margin-left: auto;
    margin-right:${$uw(1)};
    background-color: ${$color('primary')};
    color:${$color("dark")};
    text-decoration: none;
    border-radius: 4px;
    display: flex;
    gap:${$uw(1)};
`;
