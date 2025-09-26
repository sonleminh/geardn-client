export const getProvinces = async () =>
    (await fetch('/api/locations/provinces', { cache: 'force-cache' })).json() as Promise<Array<{id:number; code:number; name:string}>>;
  
  export const getDistricts = async (provinceCode: string | number) =>
    (await fetch(`/api/locations/districts?provinceCode=${provinceCode}`, { cache: 'force-cache' })).json() as Promise<Array<{id:number; code:number; name:string}>>;
  
  export const getWards = async (districtCode: string | number) =>
    (await fetch(`/api/locations/wards?districtCode=${districtCode}`, { cache: 'force-cache' })).json() as Promise<Array<{id:number; code:number; name:string}>>;
  