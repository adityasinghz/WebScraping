import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { Box, Grid, Paper } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function Actionbar({ toggleColorMode }) {
    return (
        <Grid item sx={12} md={12}>
            <Box sx={{ flexGrow: 1 }}>
                <Paper>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                WEB SCRAPPER
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Paper>
            </Box>
        </Grid>
    );
}