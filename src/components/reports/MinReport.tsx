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
    const reportUtils: { iconName: IconName, mainColor: string} = report.type == ReportType.Found 
        ?  {
            iconName:'eye',
            mainColor: "success"
        }
        : {
            iconName: "alertCircle",
            mainColor: "danger"
        }

	return <Container>
        <Header color={reportUtils.mainColor}>
            <Icon name={reportUtils.iconName}  color={reportUtils.mainColor} size="24px" />
            <p>{dayjs(report.created_at).format("ll")}</p>
        </Header>
        <p>{report.place}</p>
        
    </Container>;
});

const Container = styled.div`
	display: flex;
    padding: ${$uw(1)};
    flex-direction: column;
    background-color: ${$color("light")}
`;

const Header = styled.div<{color: string}>`
    width: 100%;
    display: flex;
    gap: ${$uw(1)};

`