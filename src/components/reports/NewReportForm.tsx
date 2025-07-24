import styled from "styled-components";
import dayjs from "dayjs";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import {
    DateTimePicker,
    Option,
    SelectInput,
    TextAreaInput,
    TextInput,
    SpecialIconName,
} from "@components";

import { $cssTRBL, $uw } from "@theme";
import { useCallback, useEffect, useState } from "react";

export const NewReportForm = () => {
    const { t } = useTranslation();
	const [locationQuery, setLocationQuery] = useState("");
	const [locationResults, setLocationResults] = useState([]);
	const [loadingLoc, setLoadingLoc] = useState(false);
	const [locError, setLocError] = useState(null);
	const fetchLocations = useCallback(
		_.debounce(async (query) => {
		  if (!query) {
			setLocationResults([]);
			setLoadingLoc(false);
			return;
		  }
		  setLoadingLoc(true);
		  setLocError(null);
		  try {
			const res = await fetch(
			  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
				query
			  )}`,
			  {
				headers: {
				  'Accept-Language': 'en',
				  'User-Agent': 'YourAppName/1.0 (your.email@example.com)',
				},
			  }
			);
			if (!res.ok) throw new Error(`Error: ${res.status}`);
			const data = await res.json();
			setLocationResults(data);
		  } catch (err) {
			 console.log(err)
		  } finally {
			setLoadingLoc(false);
		  }
		}, 500),
		[]
	  );


	  useEffect(() => {
		fetchLocations(locationQuery);
		return () => fetchLocations.cancel();
	  }, [locationQuery, fetchLocations]);
    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <TextInput
                name="data.name"
                textLabel="events.name"
                bgColor="light"
                required
            />
            <TextInput
                name="location"
                textLabel="events.location"
                bgColor="light"
                value={locationQuery}
				// @ts-ignore
                onChange={(e) => setLocationQuery(e)}
                
            />
            <DateTimePicker
                name="date_date"
                textLabel="events.date_from"
                type="date"
                className="main_date"
                bgColor="light"
                required
            />
            <DateTimePicker
                name="date_time"
                textLabel="events.time"
                type="time"
                className="main_time"
                bgColor="light"
                required
            />
            <TextAreaInput
                name="notes"
                textLabel="events.notes"
                bgColor="light"
            />
        </Form>
    );
};

const Form = styled.div`
    width: 100%;
    overflow-y: scroll;
    max-height: ${$uw(40)};
    display: flex;
    padding: ${$cssTRBL(2, 2)};
    flex-wrap: wrap;
    justify-content: space-between;
    .main_date {
        width: 55%;
    }
    .main_time {
        width: 40%;
    }
`;
