import styled from "styled-components";
import React from "react";
import dayjs from "dayjs";

import { MinReportFragment } from "@graphql_generated/MinReport.generated";
import { Icon } from "@components";
import { IconName } from "@components";
import { ReportType } from "@types";
import { $uw, $color } from "@theme";

type Props = {
	report: MinReportFragment;
};

export const MinReport: React.FC<Props> = React.memo(({ report }) => {
	const reportUtils: { iconName: IconName; mainColor: string } =
		report.type == ReportType.Found
			? {
					iconName: "eye",
					mainColor: "warning",
			  }
			: {
					iconName: "alertCircle",
					mainColor: "danger",
			  };

	return (
		<Container color={reportUtils.mainColor}>
			<Header>
				<Icon
					className="icon"
					name={reportUtils.iconName}
					color={reportUtils.mainColor}
					uw={1.6}
				/>
				<p>{dayjs(report.created_at).format("dddd DD MMM, HH:mm ")}</p>
			</Header>
			<LocationLink
				href={`https://www.google.com/maps/@${report.latitude},${report.longitude},15z`}
			>
				{report.place} <Icon name="location" color="primary" />
			</LocationLink>
		</Container>
	);
});

const Container = styled.div<{ color: string }>`
	display: flex;
	padding: ${$uw(1)};
	flex-direction: column;
	width: 100%;
	background-color: ${$color("light")};
	height: ${$uw(6)};
	border-radius: 4px;
	margin-bottom: ${$uw(2)};
	position: relative;
	overflow: hidden;
	&::before {
		content: "";
		width: ${$uw(4)};
		position: absolute;
		height: ${$uw(10)};
		transform: rotate(45deg);
		top: ${$uw(-4)};
		left: ${$uw(-2)};
		background-color: ${({ color }) => $color(color)};
	}

`;

const Header = styled.div`
	width: 100%;
	display: flex;
	gap: ${$uw(1)};
	margin-bottom: ${$uw(1)};
	> * {
		margin: 0;
	}
	.icon {
		position: relative;
		&::before {
			position: absolute;
			width: ${$uw(2)};
			height: ${$uw(2)};
			top: ${$uw(-0.2)};
			left: ${$uw(-0.2)};
			border-radius: 100px;
			background-color: ${$color("light")};
			content: "";
		}
	}
`;

const LocationLink = styled.a`
	display: flex;
	align-items: end;
	text-decoration: none;
`;
