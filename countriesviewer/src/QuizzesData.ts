import { useEffect, useState } from "react";
export function useFlags(): [[string, string][], Map<string, string>, boolean, boolean, () => void] {
    const [flag, setFlag] = useState<[string, string][]>([]);
    const [flagAlt, setFlagAlt] = useState(new Map<string, string>());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        if (flag.length === 0 && !error && !loading) {
            const uri = `https://restcountries.com/v3.1/all?fields=name,flags`;
            setLoading(true);
            setError(false);
            fetch(uri).then((response) => {
                if (!response.ok) {
                    setError(true);
                    return Promise.resolve([]);
                }
                return response.json();
            }).then((data) => {
                const flags: [string, string][] = [];
                const flagAlt = new Map<string, string>();
                for (const x of data) {
                    const name: string = x["name"]["common"];
                    const flag: string = x["flags"]["png"];
                    const alt: string = x["flags"]["alts"];
                    flags.push([name, flag]);
                    flagAlt.set(flag, alt);
                }
                setFlag(flags);
                setFlagAlt(flagAlt);
                setLoading(false);
                setError(false);
            }).catch(() => {
                setError(true);
                setLoading(false);
            });
        }
    }, [flag.length, error, loading])
    const retry = () => setError(false);
    return [flag, flagAlt, loading, error, retry];
}

export function useCurrencies(): [[string, string][], boolean, boolean, () => void] {
    const [currencies, setCurrencies] = useState<[string, string][]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        if (currencies.length === 0 && !error && !loading) {
            const uri = `https://restcountries.com/v3.1/all?fields=name,currencies`;
            setLoading(true);
            setError(false);
            fetch(uri).then((response) => {
                if (!response.ok) {
                    setError(true);
                    return Promise.resolve([]);
                }
                return response.json();
            }).then((data) => {
                const cap: [string, string][] = [];
                for (const x of data) {
                    const name = x["name"]["common"];
                    const currencies = x["currencies"]
                    for (const currency in currencies) {
                        cap.push([name, `${currencies[currency].name}(${currencies[currency].symbol})`]);
                    }
                }
                setCurrencies(cap);
                setLoading(false);
                setError(false);
            }).catch(() => {
                setError(true);
                setLoading(false);
            });
        }
    }, [currencies.length, error, loading])
    const retry = () => setError(false);
    return [currencies, loading, error, retry];
}
export function useCapitals(): [[string, string][], boolean, boolean, () => void] {
    const [capitals, setCapitals] = useState<[string, string][]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        if (capitals.length === 0 && !error && !loading) {
            const uri = `https://restcountries.com/v3.1/all?fields=name,capital`;
            setLoading(true);
            setError(false);
            fetch(uri).then((response) => {
                if (!response.ok) {
                    setError(true);
                    return Promise.resolve([]);
                }
                return response.json();
            }).then((data) => {
                const cap: [string, string][] = [];
                for (const x of data) {
                    const name = x["name"]["common"];
                    const capitals = x["capital"];
                    for (const capital of capitals) {
                        cap.push([name, capital]);
                    }
                }
                setCapitals(cap);
                setLoading(false);
                setError(false);
            }).catch(() => {
                setError(true);
                setLoading(false);
            });
        }
    }, [capitals.length, error, loading])
    const retry = () => setError(false);
    return [capitals, loading, error, retry];
}