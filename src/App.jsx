import React, { Component } from 'react';
import BpkCalendar, { CALENDAR_SELECTION_TYPE } from '@skyscanner/backpack-web/bpk-component-calendar';
import BpkInput, { INPUT_TYPES } from '@skyscanner/backpack-web/bpk-component-input';
import BpkButton from '@skyscanner/backpack-web/bpk-component-button';
import BpkText from '@skyscanner/backpack-web/bpk-component-text';
import { cssModules } from '@skyscanner/backpack-web/bpk-react-utils';
import format from 'date-fns/format';
import {
addMonths,
addDays,
startOfDay,
isAfter,
isSameDay,
add,
} from 'date-fns';
import STYLES from './App.scss';

const getClassName = cssModules(STYLES);

const formatDateFull = (date) => format(date, 'EEEE, do MMMM yyyy');
const formatMonth = (date) => format(date, 'MMMM yyyy');

const daysOfWeek = [
    {
        name: 'Sunday',
        nameAbbr: 'Sun',
        index: 0,
        isWeekend: true,
    },
    {
        name: 'Monday',
        nameAbbr: 'Mon',
        index: 1,
        isWeekend: false,
    },
    {
        name: 'Tuesday',
        nameAbbr: 'Tue',
        index: 2,
        isWeekend: false,
    },
    {
        name: 'Wednesday',
        nameAbbr: 'Wed',
        index: 3,
        isWeekend: false,
    },
    {
        name: 'Thursday',
        nameAbbr: 'Thu',
        index: 4,
        isWeekend: false,
    },
    {
        name: 'Friday',
        nameAbbr: 'Fri',
        index: 5,
        isWeekend: false,
    },
    {
        name: 'Saturday',
        nameAbbr: 'Sat',
        index: 6,
        isWeekend: true,
    },
    ];

    export default class App extends Component {
        constructor() {
            super();
            this.state = {
                selectionConfiguration: {
                    type: CALENDAR_SELECTION_TYPE.range,
                    startDate: null,
                    endDate: null,
                },
                startDate: '',
                endDate: '',
                editingDeparture: true,
                numberOfDays: 0,
            };
        }          

        handleDateSelect = (date) => {
            const { selectionConfiguration, startDate, endDate, editingDeparture } = this.state;
        
            if (!startDate || editingDeparture) {
            this.setState((prevState) => ({
                startDate: formatDateFull(date),
                selectionConfiguration: {
                type: CALENDAR_SELECTION_TYPE.range,
                startDate: date,
                endDate: null,
                },
                editingDeparture: false,
            }));
            } else if (!endDate || editingDeparture || date < startDate) {
                if (date < startDate) {
                    alert('Arrival date must be later than departure date.');
                } else {
                    this.setState((prevState) => ({
                    endDate: formatDateFull(date),
                    selectionConfiguration: {
                        ...prevState.selectionConfiguration,
                        endDate: date,
                    },
                    editingDeparture: true,
                    }));
                }
            } else {
            // Handle the case when the same date is selected again for the second time
            this.setState({
                startDate: formatDateFull(date),
                endDate: '',
                selectionConfiguration: {
                type: CALENDAR_SELECTION_TYPE.range,
                startDate: date,
                endDate: null,
                },
                editingDeparture: false,
            });
            }
        };
        
        // Function that handles changing the number of days on the counter
        handleNumberOfDaysChange = (event) => {
            const numberOfDays = event.target.value;
            this.setState({ numberOfDays });
        
            // Update arrival date based on number of days
            if (this.state.selectionConfiguration.startDate) {
            const arrivalDate = add(this.state.selectionConfiguration.startDate, {
                days: numberOfDays,
            });
            this.setState({
                endDate: formatDateFull(arrivalDate),
                selectionConfiguration: {
                ...this.state.selectionConfiguration,
                endDate: arrivalDate,
                },
            });
            }
        };

    // Functions that support field editing
    handleDepartureEdit = () => {
        this.setState({ editingDeparture: true });
    };

    handleArrivalEdit = () => {
        this.setState({ editingDeparture: false });
    };

    handleClearDates = () => {
        this.setState({
        selectionConfiguration: {
            type: CALENDAR_SELECTION_TYPE.range,
            startDate: null,
            endDate: null,
        },
        startDate: '',
        endDate: '',
        });
    };

    dateModifiers = (date) => {
        const { selectionConfiguration } = this.state;
        const isDepartureDate = isSameDay(date, selectionConfiguration.startDate);
        const isArrivalDate = isSameDay(date, selectionConfiguration.endDate);

        const modifiers = {};

        if (isDepartureDate) {
        modifiers.departureDate = true;
        }

        if (isArrivalDate) {
        modifiers.arrivalDate = true;
        }

        if (selectionConfiguration.startDate && selectionConfiguration.endDate) {
        if (isAfter(date, selectionConfiguration.startDate) && isAfter(selectionConfiguration.endDate, date)) {
            modifiers.highlightedDates = true;
        }
        }

        return modifiers;
    };

    dateProps = (date) => {
        const modifiers = this.dateModifiers(date);

        return {
            className: Object.keys(modifiers).join(' '),
        };
    };

    render() {
        // Create objects with functions for dateModifiers and dateProps
        const dateModifiersObject = {};
        const datePropsObject = {};

        // Iteration through the days of the week
        daysOfWeek.forEach((day) => {
            const dayNameLower = day.nameAbbr.toLowerCase();
            dateModifiersObject[dayNameLower] = (date) => this.dateModifiers(date);
            datePropsObject[dayNameLower] = (date) => this.dateProps(date);
        });

        const inputContainerStyle = {
            display: 'flex',
            justifyContent: 'space between',
        };

        const inputStyle = {
            width: '300px',
            marginTop: '10px'
        };

        const parentContainerStyle = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        };

        const labelTextStyle = {
            marginTop: '10px'
        }

        const buttonContainerStyle = {
            display: 'flex',
            justifyContent: 'centre',
        };

        const buttonStyle = {
            marginTop: '20px',
            marginRight: '20px'
        };

        return (
        <div className={getClassName('App')}>
            <header className={getClassName('App__header')}>
            <div className={getClassName('App__header-inner')}>
                <BpkText tagName="h1" textStyle="xxl" className={getClassName('App__heading')}>
                Flight Schedule.
                </BpkText>
            </div>
            </header>
            <main className={getClassName('App__main')} style={parentContainerStyle}>
            <BpkText tagName="p" style = {labelTextStyle}>Travel Days</BpkText>
            <BpkInput
                id="departureDateInput"
                type={INPUT_TYPES.text}
                name="departureDate"
                value={this.state.startDate}
                placeholder="Departure date"
                onChange={(event) => {
                this.setState({ startDate: event.target.value });
                }}
                onFocus={this.handleDepartureEdit}
                style = {inputStyle}
            />
            <BpkInput
                id="arrivalDateInput"
                type={INPUT_TYPES.text}
                name="arrivalDate"
                value={this.state.endDate}
                placeholder="Arrival date"
                onChange={(event) => {
                this.setState({ endDate: event.target.value });
                }}
                onFocus={this.handleArrivalEdit}
                disabled={true}
                style = {inputStyle}
            />
            <BpkText tagName="p" style = {labelTextStyle}>Number of Travel Days</BpkText>
            <BpkInput
                id="numberOfDaysInput"
                type={INPUT_TYPES.number}
                name="numberOfDays"
                min="0"
                value={this.state.numberOfDays.toString()}
                placeholder="Number of days"
                onChange={this.handleNumberOfDaysChange} // Handling change in number of days
                style = {inputStyle}
            />
            <br />
            <br />
            {/* Render the BpkCalendar component */}
            <BpkCalendar
                id="calendar"
                onDateSelect={this.handleDateSelect}
                formatMonth={formatMonth}
                formatDateFull={formatDateFull}
                daysOfWeek={daysOfWeek}
                weekStartsOn={0}
                changeMonthLabel="Change month"
                nextMonthLabel="Next month"
                previousMonthLabel="Previous month"
                weekDayKey="nameAbbr"
                selectionConfiguration={this.state.selectionConfiguration}
                dateModifiers={dateModifiersObject}
                dateProps={datePropsObject}
            />
            <br />
            <div style={buttonContainerStyle}>
                <BpkButton onClick={this.handleClearDates} style={buttonStyle}>Clear</BpkButton>{' '}
                <BpkButton onClick={() => alert('It works!')} style={buttonStyle}>Continue</BpkButton>
            </div>
            </main>
        </div>
        );
    }
}
