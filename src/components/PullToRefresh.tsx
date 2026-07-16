import {
    IonRefresher,
    IonRefresherContent,
    RefresherEventDetail,
} from "@ionic/react";
import { useApolloClient } from "@apollo/client";
import { useCallback } from "react";

/**
 * Drop-in pull-to-refresh for any page. Place as the first child of
 * <IonContent>.
 *
 * Without props it refetches every Apollo query currently observed on
 * the page (client.reFetchObservableQueries), so pages don't need any
 * per-page wiring. Pass `onRefresh` to override with custom logic.
 * The spinner stays visible until the refetch settles; complete() is
 * called in `finally` so a failed refetch can never leave the refresher
 * stuck open.
 */
export const PullToRefresh: React.FC<{
    onRefresh?: () => Promise<unknown> | unknown;
}> = ({ onRefresh }) => {
    const client = useApolloClient();

    const handleRefresh = useCallback(
        async (event: CustomEvent<RefresherEventDetail>) => {
            try {
                await (onRefresh
                    ? onRefresh()
                    : client.reFetchObservableQueries());
            } finally {
                event.detail.complete();
            }
        },
        [onRefresh, client]
    );

    return (
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
        </IonRefresher>
    );
};
