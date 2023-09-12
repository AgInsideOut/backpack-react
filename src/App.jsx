import React, { useState, Component } from 'react';
import BpkCalendar from 'bpk-component-calendar';
import BpkInput, { INPUT_TYPES } from 'bpk-component-input';
import format from 'date-fns/format';
import { BpkCode } from '@skyscanner/backpack-web/bpk-component-code';
import BpkButton from '@skyscanner/backpack-web/bpk-component-button';
import BpkText from '@skyscanner/backpack-web/bpk-component-text';
import { cssModules } from '@skyscanner/backpack-web/bpk-react-utils';
import STYLES from './App.scss';

const formatDateFull = date => format(date, 'EEEE, do MMMM yyyy');
const formatMonth = date => format(date, 'MMMM yyyy');

const getClassName = cssModules(STYLES);

const CALENDAR_SELECTION_TYPE = {
  range: 'range',
  single: 'single',
};

    const daysOfWeek =
    [
      {
        name: 'Sunday',
        nameAbbr: 'Sun',
        index: 0,
        isWeekend: true
      },
      {
        name: 'Monday',
        nameAbbr: 'Mon',
        nameNarrow: 'M',
        index: 1,
        isWeekend: false
      },
      {
        name: 'Tuesday',
        nameAbbr: 'Tue',
        nameNarrow: 'Tu',
        index: 2,
        isWeekend: false
      },
      {
        name: 'Wednesday',
        nameAbbr: 'Wed',
        nameNarrow: 'W',
        index: 3,
        isWeekend: false
      },
      {
        name: 'Thursday',
        nameAbbr: 'Thu',
        nameNarrow: 'Th',
        index: 4,
        isWeekend: false
      },
      {
        name: 'Friday',
        nameAbbr: 'Fri',
        nameNarrow: 'F',
        index: 5,
        isWeekend: false
      },
      {
        name: 'Saturday',
        nameAbbr: 'Sat',
        nameNarrow: 'Sa',
        index: 6,
        isWeekend: true
      }
    ]

    export default class App extends Component {
      constructor () {
          super();
  
          this.state = {
          selectionConfiguration: {
            type: CALENDAR_SELECTION_TYPE.range,
            startDate: null,
            endDate: null
          },
          inputValue: '',
          arrivalDate: null,
          };
      }
  
      handleDateSelect = (date) => {
        const { selectionConfiguration } = this.state;
      
        if (!selectionConfiguration.startDate || (selectionConfiguration.startDate && selectionConfiguration.endDate)) {
          // Jeśli nie ma wybranej daty wylotu lub obie daty (wylotu i przylotu) są już wybrane,
          // to ustawiany jest nowy zakres daty wylotu i przylotu
          this.setState((prevState) => ({
            selectionConfiguration: {
              type: CALENDAR_SELECTION_TYPE.range,
              startDate: date,
              endDate: null,
            },
            departureDateInputValue: formatDateFull(date),
            arrivalDateInputValue: '', // Wyczyść datę przylotu
          }));
        } else if (selectionConfiguration.startDate && !selectionConfiguration.endDate) {
          // Jeśli jest wybrana data wylotu, ale nie ma daty przylotu,
          // to ustaw datę przylotu
          this.setState((prevState) => ({
            arrivalDate: date,
            arrivalDateInputValue: formatDateFull(date),
          }));
        }
      };

      handleClearDates = () => {
        this.setState({
          selectionConfiguration: {
            type: CALENDAR_SELECTION_TYPE.range,
            startDate: null,
            endDate: null,
          },
          departureDateInputValue: '',
          arrivalDateInputValue: '',
        });
      };

      // Add the dateModifiers function, which returns the appropriate CSS classes for dates
      dateModifiers = (date) => {
        const { selectionConfiguration, arrivalDate } = this.state;
      
        if (
          selectionConfiguration.startDate &&
          arrivalDate &&
          date > selectionConfiguration.startDate &&
          date < arrivalDate
        ) {
          return ['highlighted-dates'];
        }
      
        return [];
      };

      // Add a dateProps function that adjusts the props for dates
      dateProps = (date) => {
        return {
          className: this.dateModifiers(date).join(' '),
        };
      };

    render() {
      return (
          <div className={getClassName('App')}>
            <header className={getClassName('App__header')}>
                <div className={getClassName('App__header-inner')}>
                <BpkText tagName='h1' textStyle='xxl' className={getClassName('App__heading')}>
                    Flight Schedule.
                </BpkText>
                </div>
            </header>
            <main className={getClassName('App__main')}>
              <BpkInput
                id="departureDateInput"
                type={INPUT_TYPES.text}
                name="departureDate"
                value={this.state.departureDateInputValue}
                placeholder="Departure date"
                onChange={(event) => {
                  this.setState({ departureDateInputValue: event.target.value });
                }}
              />
              <br /><br />
              <BpkInput
                id="arrivalDateInput"
                type={INPUT_TYPES.text}
                name="arrivalDate"
                value={this.state.arrivalDateInputValue}
                placeholder="Arrival date"
                onChange={(event) => {
                  this.setState({ arrivalDateInputValue: event.target.value });
                }}
              />
              <br /><br />
              {/* Render the BpkCalendar component */}
              <BpkCalendar
                id='calendar'
                onDateSelect={this.handleDateSelect}
                formatMonth={formatMonth}
                formatDateFull={formatDateFull}
                daysOfWeek={daysOfWeek}
                weekStartsOn={1}
                changeMonthLabel="Change month"
                nextMonthLabel="Next month"
                previousMonthLabel="Previous month"
                selectionConfiguration={this.state.selectionConfiguration}
                dateModifiers={this.dateModifiers}
                dateProps={this.dateProps}
              />
              <br />
              <BpkButton onClick={this.handleClearDate}>Clear</BpkButton>{' '} 
              <BpkButton onClick={() => alert('It works!')}>Continue</BpkButton>
            </main>
          </div>
      );
    }
};
