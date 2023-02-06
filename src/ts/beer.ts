
interface Volume {
    value: number;
    unit: string;
}

interface BoilVolume {
    value: number;
    unit: string;
}

interface Temp {
    value: number;
    unit: string;
}

interface MashTemp {
    temp: Temp;
    duration: number;
}

interface Temp2 {
    value: number;
    unit: string;
}

interface Fermentation {
    temp: Temp2;
}

interface Method {
    mash_temp: MashTemp[];
    fermentation: Fermentation;
    twist?: any;
}

interface Amount {
    value: number;
    unit: string;
}

interface Malt {
    name: string;
    amount: Amount;
}

interface Amount2 {
    value: number;
    unit: string;
}

interface Hop {
    name: string;
    amount: Amount2;
    add: string;
    attribute: string;
}

interface Ingredients {
    malt: Malt[];
    hops: Hop[];
    yeast: string;
}

export default interface RootObject {
    id: number;
    name: string;
    tagline: string;
    first_brewed: string;
    description: string;
    image_url?: any;
    abv: number;
    ibu: number;
    target_fg: number;
    target_og: number;
    ebc: number;
    srm: number;
    ph: number;
    attenuation_level: number;
    volume: Volume;
    boil_volume: BoilVolume;
    method: Method;
    ingredients: Ingredients;
    food_pairing: string[];
    brewers_tips: string;
    contributed_by: string;
}