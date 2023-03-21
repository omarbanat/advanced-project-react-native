import { StyleSheet, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const TableComp = () => {
  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row
          data={['Head', 'Head2', 'Head3', 'Head4']}
          style={styles.head}
          textStyle={styles.text}
        />
        <Rows
          data={[
            ['1', '2', '3', '4'],
            ['a', 'b', 'c', 'd'],
            ['1', '2', '3', '456\n789'],
            ['a', 'b', 'c', 'd'],
          ]}
          textStyle={styles.text}
        />
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
});

export default TableComp;
