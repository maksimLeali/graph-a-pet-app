import styled from "styled-components";
import React from "react";
import dayjs from "dayjs";

import { MinReportFragment } from "@graphql_generated/MinReport.generated";
import { Icon } from "@components";
import { IconName } from "@components";
import { ReportType } from "@types";
import { $uw, $color } from "@theme";
import { Link } from "react-router-dom";

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
		<Container key={report.id} color={reportUtils.mainColor} >
			<Header to={`/board/${report.id}`} >
				<Icon
					className="icon"
					name={reportUtils.iconName}
					color={reportUtils.mainColor}
					uw={1.6}
				/>
				<p>{dayjs(report.created_at).format("dddd DD MMM, HH:mm ")}</p>
			</Header>
			<LocationLink
				// href={`https://www.google.com/maps/?api=1&query=${report.latitude},${report.longitude}`}
				href={`https://www.google.com/maps/?q=&layer=c&cbll=${report.latitude},${report.longitude}&cbp=11,0,0,0,0`}
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
	background-color: ${$color("light-tint")};
	height: ${$uw(6)};
	border-radius: 4px;
	margin-bottom: ${$uw(2)};
	position: relative;
	overflow: hidden;
	text-decoration: none;
	box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
		rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
	.dark & {
		box-shadow: none;
	}
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
	p {
		color:${$color('dark')};
		text-decoration: none;
	}
`;

const Header = styled(Link)`
	width: 100%;
	display: flex;
	text-decoration: none;
	gap: ${$uw(1)};
	margin-bottom: ${$uw(.5)};
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
			background-color: ${$color("light-tint")};
			content: "";
		}
		> * {
			transition: none;
		}
	}
`;

const LocationLink = styled.a`
	display: flex;
	align-items: center;
	text-decoration: none;
	justify-content: space-between;
	padding-left: ${$uw(2.5)};
`;
