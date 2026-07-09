import { useEffect } from "react";
import styled from "styled-components";
import { useHistory, useParams } from "react-router";
import { IonContent } from "@ionic/react";

import { $uw } from "@theme";
import { useMyShelterRole } from "../hooks/useMyShelterRole";

type Props = {
	children: React.ReactNode;
};

// Gates operational shelter screens (tasks, walks, people, boxes, ownership...)
// to actual members. Backend does not yet enforce this on read queries, so
// this is a best-effort client-side redirect, not a security boundary.
export const RequireShelterMember: React.FC<Props> = ({ children }) => {
	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	const { isMember, loading } = useMyShelterRole(id);

	useEffect(() => {
		if (!loading && !isMember) {
			history.replace(`/shelters/public/${id}`);
		}
	}, [loading, isMember, id]);

	if (loading || !isMember) {
		return (
			<IonContent>
				<Placeholder className="skeleton" />
			</IonContent>
		);
	}

	return <>{children}</>;
};

const Placeholder = styled.div`
	width: 100%;
	height: ${$uw(20)};
	margin: ${$uw(2)} 12px;
`;
