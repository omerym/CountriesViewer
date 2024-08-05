import React from 'react';
import { useState } from 'react';
import './css/App.css'
import './css/SearchBar.css'
import './css/CountryList.css'
import { useCountries, Flag, CountryName, useCountryDetails } from './Countries';
import Navbar from './Navbar';
function App() {
    const [countries, loading, setQueryName, error, reload] = useCountries();
    const [selectedCountryName, selectedCountryFlag, setSelectedCountry] = useSelectedCountry(countries);
    let countriesView: JSX.Element;
    if (loading) {
        countriesView = <Loading />;
    }
    else if (countries.length !== 0) {
        countriesView = <CountryList countries={countries} setCountry={setSelectedCountry} />
    }
    else if (error) {
        countriesView = <Error retry={reload }>An error has occured.<br />check your connection</Error>;
    }
    else {
        countriesView = <div className="empty-list">No countries found.</div >;
    }
    return <>
        <header>
            <Navbar />
            <Search setQueryName={setQueryName}/>
            <RandomCountryBytton countries={countries} setCountry={setSelectedCountry} />
        </header>
        <CountryDetails countryName={selectedCountryName} flag={selectedCountryFlag} />
        {countriesView}
    </>;
}
interface ErrorProps { children?: React.ReactNode, retryMessage?: string, retry: () => void }
function Error({ children, retryMessage = "click here to retry.", retry }: ErrorProps) {
    return (
        <div className="error">
            {children}
            <button onClick={retry}>{retryMessage}</button>
        </div>
    );
}
function useSelectedCountry(countries: [CountryName, Flag][], initialName: string = ''):
    [CountryName | undefined, Flag | undefined, (name: string) => void] {
    const [name, setSelectedCountry] = useState(initialName);
    const c = countries.filter(x => x[0].officialName === name || x[0].commonName == name);
    const countryName = c.length === 0 ? undefined : c[0][0];
    const countryFlag = c.length === 0 ? undefined : c[0][1];
    return [countryName, countryFlag, setSelectedCountry];
}
interface RandomCountryByttonProps { countries: [CountryName, Flag][], setCountry: (name: string) => void }
function RandomCountryBytton({ countries, setCountry }: RandomCountryByttonProps) {
    return (
        <button className="random-country-button" onClick={() => {
            if (countries.length !== 0) {
                const index = Math.floor(Math.random() * (countries.length - 1));
                const country = countries[index][0].officialName;
                setCountry(country);
            }
        }}>random country</button>
    );
}
interface CountryDetailsProps { countryName?: CountryName, flag?: Flag }
function CountryDetails({ countryName, flag }: CountryDetailsProps) {
    const [name, setCountry, countryDetails, error, loading, reload] = useCountryDetails();
    let countryView: JSX.Element;
    if (countryName == undefined || flag == undefined) {
        return <></>;
    }
    const nameFlag = (
        <section>
            <h2>{countryName.commonName}</h2>
            <h3>{countryName.officialName}</h3>
            <img src={flag.png} alt={flag.alt} />
        </section>
    );
    if (loading) {
        countryView = (
            <div className="country-details-container">
                {nameFlag}
                <Loading />
            </div>)
            ;
    }
    else if (name !== countryName.officialName) {
        countryView = <></>;
        setCountry(countryName.officialName);
    }
    else if (error) {
        countryView = (
            <div className="country-details-container">
                {nameFlag}
                <Error retry={reload}>Failed to load {countryName.commonName}'s details.</Error>
            </div>)
            ;
    }
    else if (countryDetails.name === '') {
        countryView = <></>;
    }
    else {
        const [nativeNamesTitle, nativeNames] = reduceList("Native Name", countryName.officialNativeNames);
        const [capitalsTitle, capital] = reduceList("Capital", countryDetails.capital);
        const [continentsTitle, continents] = reduceList("Continent", countryDetails.continents);
        const [languagesTitle, languages] = reduceList("Language", countryDetails.languages);
        const [currenciesTitle, currencies] = reduceList("Currency", countryDetails.currencies.map(x=>`${x[0]}(${x[1]})`), "Currencies");
        countryView =
            (
                <article className="country-details-container">
                    {nameFlag}
                    <section className="country-details">
                        {nativeNames !== '' && <><strong>{nativeNamesTitle}</strong>: {nativeNames}.<br /></>}
                        {nativeNames !== '' && <><strong>{capitalsTitle}</strong>: {capital}.<br /></>}
                        {nativeNames !== '' && <><strong>{continentsTitle}</strong>: {continents}.<br /></>}
                        {nativeNames !== '' && <><strong>{languagesTitle}</strong>: {languages}.<br /></>}
                    {currencies !== '' && <><strong>{currenciesTitle}</strong>: {currencies}.<br /></>}
                    <strong>area</strong>: {countryDetails.area} km<sup>2</sup>.<br />
                        <strong>region</strong>: {countryDetails.region}, {countryDetails.subregion}.<br />
                        <strong>population</strong>: {countryDetails.population}.<br />
                    </section>
                </article>
            );
    }

    return countryView;
}

function reduceList(title: string, list: string[], pluralTitle:string|undefined = undefined): [string,string] {
    if (list.length === 0) {
        return ['',''];
    }
    const str = list.reduce((s, c, i) => {
        if (i === 0) {
            return c;
        }
        return s + ', ' + c;
    }, '')
    pluralTitle = pluralTitle == undefined ? title + 's' : pluralTitle;
    return [(list.length === 1 ? title : pluralTitle), str];
}
interface SearchProps { setQueryName: (name: string) => void}
function Search({ setQueryName }: SearchProps) {
    const [query, setQuery] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        if (event.target.value === '') {
            setQueryName(event.target.value);
        }
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setQueryName(query)
    };
    const handleReset = () => {
        setQuery('');
        setQueryName('');
    };
    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input name="q" type="search" value={query} onChange={handleChange} placeholder="Search by country name..." />
            <button type="submit">Go</button>
            {query !== '' && (<button onClick={handleReset}>All</button>)}
        </form>
    );
}
function Loading() {
    return <div className="loading"></div>;
}
interface CountryListProps { countries: [CountryName, Flag][], setCountry?: (name: string) => void }
function CountryList({ countries, setCountry }: CountryListProps) {
    if (countries.length === 1 && setCountry != undefined) {
        setCountry?.(countries[0][0].officialName);
        return <></>;
    }
    const _countries = countries.map((country, i: number) =>
        (<Country name={country[0]} flag={country[1]} maxNativeNames={3} key={i} setCountry={setCountry} />))
    return <div className="country-list">{_countries}</div>;
}
interface CountryProps { name: CountryName, flag: Flag, maxNativeNames?: number, setCountry?: (name: string) => void }
function Country({ name, flag, maxNativeNames, setCountry }: CountryProps) {
    const nativeNames = maxNativeNames == undefined ? name.officialNativeNames :
        name.officialNativeNames.slice(0, maxNativeNames);
    const nativeNameViews = nativeNames.map((name: string, i: number) =>
        (<div key={i}>{name}</div>));
    const clickHandler = () => {
        setCountry?.(name.officialName);
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return (
        <button className="country" onClick={clickHandler}>
            <h3>{name.commonName}</h3>
            <h5>{name.officialName}</h5>
            <img className="flag" src={flag.png} alt={flag.alt} />
            {nativeNameViews}
        </button>
    );
}
export default App
