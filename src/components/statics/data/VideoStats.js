import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CSSModules from 'react-css-modules';
import styles from './VideoStats.scss';

class VideoStats extends React.Component {


  componentDidMount = () => {

  }

  render () {
    return (
       <Paper className={`${styles.paper}`}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell numeric>Calories</TableCell>
                <TableCell numeric>Fat (g)</TableCell>
                <TableCell numeric>Carbs (g)</TableCell>
                <TableCell numeric>Protein (g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell numeric>6</TableCell>
                <TableCell numeric>8</TableCell>
                <TableCell numeric>34</TableCell>
                <TableCell numeric>67</TableCell>
              </TableRow>
            </TableBody>
          </Table>
       </Paper>
    )

  }
}

export default CSSModules(VideoStats, styles)
