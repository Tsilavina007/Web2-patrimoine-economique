
const usefetchPatrimoineData = async (dateDebut, dateFin, day) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const response = await fetch(`${apiUrl}/patrimoine/range?dateDebut=${dateDebut.toISOString()}&dateFin=${dateFin.toISOString()}&day=${day}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patrimoine data');
      }
    
    const data = await response.json();
    return data;
};

export default usefetchPatrimoineData;