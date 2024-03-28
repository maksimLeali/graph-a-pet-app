import styled from "styled-components"
import { $cssTRBL, $uw } from "../utils/theme/functions"

export const WeeksSkeleton:React.FC = ()=> {
    return <FakeWeekContainer>
        <FakeWeek >
            {[...Array(7)].map((el, i)=> {
                return <SkeletonDay key={i} className="skeleton"/>
            })}
        </FakeWeek>
    </FakeWeekContainer>
}



const FakeWeekContainer = styled.div`
width: 100%;
`

const FakeWeek = styled.div`
    height: ${$uw(5)};
    padding: ${$cssTRBL(1, 0, 1, 1)};
    box-sizing: border-box;
    border-bottom: 1px solid;
    border-top: 1px solid;
    border-color: var(--ion-color-medium);
    display: flex;
    justify-content: space-between;
`  

const SkeletonDay = styled.div`
    width: ${$uw(3.2)};
    flex: 0 0 ${$uw(3.2)};
    margin-right: calc(${$uw(9.6)} / 8);
    border-radius:10px;
    height:${$uw(3)};
`   