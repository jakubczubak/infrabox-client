// Importy zewnętrzne
import { TextField, InputAdornment, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const findClosestMatch = (searchInput, data, type) => {
  const [x, y, z] = searchInput.split('x').map(Number);
  if (!x || !y || !z) return null; // Jeśli format jest niepoprawny, zwróć null

  // Funkcja pomocnicza do obliczania odległości XY z warunkiem x >= x i y >= y
  const calculateDistanceXY = (item) => {
    if (type === 'Plate') {
      // Odrzucamy elementy, gdzie x lub y są mniejsze od szukanych
      if (item.x < x || item.y < y) {
        return Infinity;
      }
      const dx = Math.abs(item.x - x); // Różnica dla X
      const dy = Math.abs(item.y - y); // Różnica dla Y
      return dx + dy; // Suma różnic dla X i Y
    }
    return Infinity;
  };

  // Krok 1: Szukaj dokładnego Z
  const exactZMatches = data.filter((item) => item.z === z);

  if (exactZMatches.length > 0) {
    // Jeśli jest dokładne Z, szukaj najbliższych X i Y (nie mniejszych)
    const closestItem = exactZMatches.reduce((closest, current) => {
      const currentDistance = calculateDistanceXY(current);
      const closestDistance = calculateDistanceXY(closest);
      return currentDistance < closestDistance ? current : closest;
    }, exactZMatches[0]);

    // Sprawdzamy, czy znaleziono akceptowalne dopasowanie (distance !== Infinity)
    return calculateDistanceXY(closestItem) !== Infinity ? [closestItem] : null;
  }

  // Krok 2: Jeśli nie ma dokładnego Z, szukaj najbliższego większego Z
  const largerZMatches = data.filter((item) => item.z > z); // Tylko większe Z

  if (largerZMatches.length === 0) return null; // Jeśli nie ma większych Z, zwróć null

  // Znajdź minimalną różnicę Z wśród większych Z
  const closestZLargerMatches = largerZMatches.reduce((closestItems, current) => {
    const currentDz = current.z - z;
    const closestDz = closestItems.length > 0 ? closestItems[0].z - z : Infinity;

    if (currentDz < closestDz) {
      return [current]; // Nowa lista z bliższym Z
    } else if (currentDz === closestDz) {
      return [...closestItems, current]; // Dodaj do listy, jeśli Z jest równie bliskie
    }
    return closestItems;
  }, []);

  // Krok 3: Wśród najbliższych większych Z minimalizuj X i Y (nie mniejsze niż szukane)
  const closestItem = closestZLargerMatches.reduce((closest, current) => {
    const currentDistance = calculateDistanceXY(current);
    const closestDistance = calculateDistanceXY(closest);
    return currentDistance < closestDistance ? current : closest;
  }, closestZLargerMatches[0]);

  // Zwracamy wynik tylko, jeśli spełnia warunki (distance !== Infinity)
  return calculateDistanceXY(closestItem) !== Infinity ? [closestItem] : null;
};

export const GlobalFilter = ({ filter, setFilter, data, type }) => {
  const handleFilterChange = (value) => {
    if (value.includes('x') && value.split('x').length === 3) {
      // Jeśli format to NxNxN
      const closestData = findClosestMatch(value, data, type);
      if (closestData) {
        setFilter({ value, closestData }); // Przekazujemy obiekt z wartością i wynikiem
      } else {
        setFilter(value || undefined); // Wróć do standardowego filtrowania, jeśli nie znaleziono
      }
    } else {
      setFilter(value || undefined); // Standardowe filtrowanie tekstowe
    }
  };

  return (
    <Tooltip
      PopperProps={{ disablePortal: true }}
      title="Search (e.g., WIDTH x HEIGHT x THICKNESS for dimensions)"
      placement="right">
      <TextField
        variant="standard"
        onChange={(e) => handleFilterChange(e.target.value)}
        label="Search"
        value={filter?.value || filter || ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </Tooltip>
  );
};
