import { HttpHeaderResponse } from "@angular/common/http";

export interface prayerTimeAPI {
    code?: string,
    status?: string,
    data?: prayerTimes
}

export interface hijri {
    date: Date,
    format: string,
    day: number,
    weekday: {
        en: string,
        ar: string
    },

    month: {
        number: number,
        en: string,
        ar: string,
        days: number
    },

    year: number,
    designation: {
        abbreviated: string,
        expanded: string
    },

    holidays: [],
    adjustedHolidays: [],
    method: string
}

export interface gregorian {
    date: Date,
    format: string,
    day: number,
    weekday: {
        en: string
    },

    month: {
        number: number,
        en: string
    },

    year: number,
    designation: {
        abbreviated: string,
        expanded: string
    }
        
}

export interface qibla {
    direction: {
        degrees: number,
        from: string,
        clockwise: boolean
    },

    distance: {
        value: number,
        unit: string
    }
    
}

export interface prohibitedTimes {
    sunrise: {
            start: Date,
            end: Date
        },

        noon: {
            start: Date,
            end: Date,
        },

        sunset: {
            start: Date,
            end: Date 
        }
}

export interface prayerTimes {
    times: {
        Fajr: string,
        Sunrise: string,
        Dhuhr: string,
        Asr: string,
        Sunset: string,
        Maghrib: string,
        Isha: string,
        Imsak: string,
        Midnight: string,
        Firstthird: string,
        Lastthird: string,
    }

    date: {
        readable: Date,
        timestamp: number,
        hijri: hijri,
        gregorian: gregorian
    },

    qibla: qibla,
    prohibited_times: prohibitedTimes        
}




