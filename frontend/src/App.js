import { useEffect, useState } from "react";
import BarChart from './components/BarChart'
import RadialMultiple from './components/RadialMultiple'
import Actionbar from './components/Appbar'
import { Grid, Box, Typography } from '@mui/material';
function App() {
  const [quotes, setquotes] = useState([]);
  const [avg, setavg] = useState([])
  const getQuotes = () => {
    fetch("/quotes").then(res => res.json()).then(json => setquotes(json));
  }
  const getAvg = () => {
    fetch("/average").then(res => res.json()).then(json => setavg(json));
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getQuotes();
        await getAvg();
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, e.g., set an error state
      }
    };

    fetchData();

    const intervalId = setInterval(async () => {
      try {
        await getQuotes();
        await getAvg();
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, e.g., set an error state
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);


  const buyPrices = [];
  const sellPrices = [];
  const sources = [];
  let title;

  // Iterate over the data array
  quotes.forEach(item => {
    // Check if the 'title' property exists
    if ('title' in item) {
      title = item.title;
    }
    // Extract buyPrice, sellPrice, and source
    buyPrices.push(item.buy_price);
    sellPrices.push(item.sell_price);
    sources.push(item.source);
  });
  let buyAvg;
  let sellAvg;
  let heading;
  avg.forEach(item => {
    // Check if the 'title' property exists
    if ('title' in item) {
      heading = item.title || "";
    }
    // Extract buyPrice, sellPrice, and source
    buyAvg = item.buy_price || 0;
    sellAvg = item.sell_price || 0;
  });
  console.log(buyAvg, sellAvg, heading);
  return (
    (buyPrices && buyPrices.length && sellPrices && sellPrices.length && sources && sources.length) ? (
      <Box height="100%">
        <Grid container spacing={6}>
          <Grid item xs={12} md={12}>
            <Actionbar />
          </Grid>
          <Grid item xs={12} md={6}>
            <BarChart
              title={title}
              buyPrices={buyPrices}
              sellPrices={sellPrices}
              sources={sources}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RadialMultiple
              buyAvg={buyAvg}
              sellAvg={sellAvg}
              title={heading}
            />
          </Grid>
        </Grid>
      </Box>
    ) : (
      <Typography variant="h1" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Wait...</Typography>
    )

  );
}

export default App;
