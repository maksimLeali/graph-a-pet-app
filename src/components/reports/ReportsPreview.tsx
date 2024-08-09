import { MinReportFragment } from "@graphql_generated/MinReport.generated";
import { $uw } from "@theme";
import React from "react";
import styled from "styled-components";
import { MinReport } from "./MinReport";
import { useTranslation } from "react-i18next";

type Props = {
	loading: boolean;
	reports: MinReportFragment[];
};

export const ReportsPreview: React.FC<Props> = React.memo(
	({ loading, reports }) => {
		const { t } = useTranslation();

		return (
			<Container>
				<Title>{t("home.recent_reports")}</Title>
				<List>
					{!loading &&
						(reports.length == 0 ? (
							<p>No reports</p>
						) : (
							reports.map((item) => <MinReport report={item} />)
						))}
					{loading && (
						<>
							<SkeletonReport className="skeleton" />
							<SkeletonReport className="skeleton" />
						</>
					)}
				</List>
			</Container>
		);
	}
);

const Container = styled.div`
	width: 100%;

	padding: ${$uw(1)};
	margin-bottom: ${$uw(4)};
`;

const SkeletonReport = styled.div`
	width: 100%;
	height: ${$uw(6)};
	margin-bottom: ${$uw(2)};
	border-radius: 4px;
`;

const Title = styled.h3`
	margin-bottom: ${$uw(2)};
`;

const List = styled.div`
	width: 100%;
	padding: ${$uw(1)};
`;
