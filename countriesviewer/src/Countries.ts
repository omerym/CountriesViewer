import { useState } from 'react'
import { useEffect } from 'react'

export function useCountries(initialQuery: string = ''):
    [[CountryName, Flag][], boolean, (name: string) => void, boolean, () => void] {
    const [countries, setCountries] = useState([] as [CountryName, Flag][]);
    const [query, setQuery] = useStateTrimmed(initialQuery);
    const [lastQuery, setLastQuery] = useState('\0');
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        /*
        dont load data when loading.
        load data at startu or if query changed or _load was set to true;
        */
        if (!loading && (lastQuery == '\0' || lastQuery !== query || load)) {
            setLoading(true);
            setLoad(false);
            setError(false);
            //if no query get all countries.
            const path = query === '' ||
                //if query contains non ascii characters get all countries; since the api
                // does not support non ascii characters even if encoded.
                Array.from(query).some(c => c.charCodeAt(0) > 127) ? 'all' : `name/${query}`;
            const uri = `https://restcountries.com/v3.1/${path}?fields=name,flags`;
            fetch(uri)
                .then((response) => {
                    if (!response.ok) {
                        return Promise.resolve([]);
                    }
                    return response.json();
                })
                .then(data => {
                    const names = readNames(data);
                    const flags = readFlags(data, names);
                    const _countries = filterCountries(names.
                        map((name, i) => [name, flags[i]]), query);

                    setCountries(_countries);
                    setLastQuery(query);
                    setLoading(false);
                }).catch(() => {
                    setLoading(false);
                    setCountries([] as [CountryName, Flag][]);
                    setLastQuery(query);
                    setError(true);
                })
        }
    }, [countries, query, loading, lastQuery, error, load]);
    const reload = () => setLoad(true);
    return [countries, loading, setQuery, error, reload];
}
export  class CountryDetails {
    name = '';
    area = 0;
    capital: string[] = [];
    continents: string[] = [];
    currencies: [string, string][] = [];
    region = '';
    subregion = '';
    languages: string[] = [];
    landlocked = false;
    population = 0;
}
function useStateTrimmed(initial = ''): [string, (state: string) => void] {
    const [state, _setState] = useState(initial);
    const setState = (s: string) => _setState(s.trim());
    return [state, setState];
}
export function useCountryDetails(): [string, (name: string) => void, CountryDetails, boolean,boolean,()=>void] {
    const [name, setName] = useState('');
    const [_reload, setReload] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countryDetails, setCountryDetails] = useState(new CountryDetails());
    useEffect(() => {
        if ((!loading && name != countryDetails.name && !error) || _reload) {
            setReload(false);
            if (name === '') {
                setCountryDetails(new CountryDetails());
            }
            else {
                setLoading(true);
                setCountryDetails(new CountryDetails());
                setError(false);
                const uri = `https://restcountries.com/v3.1/name/${name}?fullText=true&fields=area,capital,continents,currencies,landlocked,languages,population,region,subregion`;
                fetch(uri).then(response => {
                    if (!response.ok) {
                        return Promise.resolve([]);
                    }
                    return response.json();
                }).then(data => {
                    if (data.length === 0) {
                        setCountryDetails(new CountryDetails());
                    }
                    else {
                        const details = readCountryDetails(data[0], name);
                        setCountryDetails(details);
                    }
                    setLoading(false);
                }).catch(() => {
                    setLoading(false);
                    setCountryDetails(new CountryDetails());
                    setError(true);
                });
            }
        }
    }, [name, loading, countryDetails.name, _reload, error]);
    return [name, setName, countryDetails, error, loading, () => setReload(true)];
}
function filterCountries(countries: [CountryName, Flag][], query: string): [CountryName, Flag][] {
    if (query === '') {
        return countries;
    }
    const regex = new RegExp(query, 'i');
    return countries.filter((country: [CountryName, Flag]) => {
        const name = country[0];
        return (name.officialName.search(regex) !== -1 ||
            name.commonName.search(regex) !== -1 ||
            name.officialNativeNames.some(n => n.search(regex) !== -1) ||
            name.commonNativeNames.some(n => n.search(regex) !== -1));
    })
}
function readCountryDetails(data:any, name: string): CountryDetails {
    const country = new CountryDetails();
    if (["currencies", "languages", "capital", "continents", "landlocked", "population", "region", "subregion"].some((x) => !(x in data))) {
        return country;
    }
    country.name = name;
    const currencies = data["currencies"];
    for (const currency in currencies) {
        country.currencies.push([currencies[currency]["name"], currencies[currency]["symbol"]]);
    }
    const languages = data["languages"];
    for (const language in languages) {
        country.languages.push(languages[language]);
    }
    country.capital = data["capital"];
    country.continents = data["continents"];
    country.landlocked = data["landlocked"];
    country.population = data["population"];
    country.area = data["area"];
    country.region = data["region"];
    country.subregion = data["subregion"];
    return country;
}
function readFlags(data : any, names: CountryName[]): Flag[] {
    return data.map((country : any, i: number) => {
        const flag = country["flags"];
        const png = flag["png"];
        const svg = flag["svg"];
        const alt = flag["alt"] !== '' ? flag["alt"] : `The flag of ${names[i]}`;
        return new Flag(png, svg, alt);
    });
}
function readNames(data:any): CountryName[] {
    return data.map((country:any) => {
        const official = country["name"]["official"];
        const common = country["name"]["common"];
        const [officialNative, commonNative] = getNativeNames(country["name"]["nativeName"]);
        return new CountryName(official, common, officialNative, commonNative);
    });
}
function getNativeNames(names : any) {
    const officialNativeNames: string[] = [];
    const commonNativeNames: string[] = [];
    for (const lang in names) {
        if (lang === 'eng') {
            continue;
        }
        const name = names[lang];
        if ("official" in name) {
            officialNativeNames.push(name["official"]);
        }
        if ("common" in name) {
            commonNativeNames.push(name["common"]);
        }
    }
    return [officialNativeNames, commonNativeNames]
}
export class Flag {
    png: string;
    svg: string;
    alt: string;
    constructor(png: string, svg: string, alt: string) {
        this.png = png;
        this.svg = svg;
        this.alt = alt;
    }
}

export class CountryName {
    officialName: string;
    commonName: string;
    officialNativeNames: string[];
    commonNativeNames: string[];
    constructor(officialName: string, commonName: string, officialNativeNames: string[], commonNativeNames: string[]) {
        this.officialName = officialName;
        this.commonName = commonName;
        this.officialNativeNames = officialNativeNames;
        this.commonNativeNames = commonNativeNames;
    }
}
export default useCountries