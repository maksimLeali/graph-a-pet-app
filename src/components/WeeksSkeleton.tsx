import styled from "styled-components"

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
    height:72px;
    padding: 5px 10px 10px;
    box-sizing: border-box;
    border-bottom: 1px solid;
    border-top: 1px solid;
    border-color: var(--ion-color-medium);
    display: flex;
    justify-content: space-between;
`  

const SkeletonDay = styled.div`
    width: calc((100% - 70px )/ 7 );
    flex: 0 0 calc((100% - 70px) / 7 );
    border-radius:10px;
    height:46px;
`   