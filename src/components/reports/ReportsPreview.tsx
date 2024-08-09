import { MinReportFragment } from "@graphql_generated/MinReport.generated"
import { $uw } from "@theme"
import React from "react"
import styled from "styled-components"
import { MinReport } from "./MinReport"

type Props = {
    loading: boolean,
    reports: MinReportFragment[]
}


export const ReportsPreview: React.FC<Props> = React.memo(({loading, reports})=>{
    
    return <Container>
        { loading && ( <p>'loading...'</p>) }
        {!loading && (
            reports.length == 0 
            ? (<p>No reports</p> )
            : (
                reports.map((item)=> <MinReport report={item }/> )
        )
        )}
    </Container>
})

const Container = styled.div`
    width :100%;
    max-height: ${$uw(48)};
    
`