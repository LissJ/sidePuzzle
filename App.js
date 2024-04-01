import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';

const { width } = Dimensions.get('window');
const TILE_SIZE = width / 3;

const initialTiles = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, null], // Use null para representar o espaço vazio
];

const winningTiles = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, null], // Use null para representar o espaço vazio
];

const App = () => {
  const [tiles, setTiles] = useState(initialTiles);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    // Embaralhe as peças iniciais
    shuffleTiles();
  }, []);

  useEffect(() => {
    // Verifique se o jogador venceu após cada movimento
    checkWin();
  }, [tiles]);

  const shuffleTiles = () => {
    // Embaralhe as peças fazendo alguns movimentos aleatórios
    let shuffledTiles = [...initialTiles];
    for (let i = 0; i < 1000; i++) {
      const randomDirection = Math.floor(Math.random() * 4); // 0: Up, 1: Down, 2: Left, 3: Right
      moveTile(randomDirection, shuffledTiles, true);
    }
    setTiles(shuffledTiles);
  };

  const moveTile = (direction, currentTiles, silent = false) => {
    // Encontre a posição do espaço vazio
    let emptyPosition = findEmptyPosition(currentTiles);

    // Calcule a nova posição baseada na direção
    let newPosition = [...emptyPosition];
    switch (direction) {
      case 0: // Up
        newPosition[0]++;
        break;
      case 1: // Down
        newPosition[0]--;
        break;
      case 2: // Left
        newPosition[1]++;
        break;
      case 3: // Right
        newPosition[1]--;
        break;
      default:
        break;
    }

    // Verifique se a nova posição é válida
    if (newPosition[0] >= 0 && newPosition[0] <= 2 && newPosition[1] >= 0 && newPosition[1] <= 2) {
      // Troque as posições
      let temp = currentTiles[emptyPosition[0]][emptyPosition[1]];
      currentTiles[emptyPosition[0]][emptyPosition[1]] = currentTiles[newPosition[0]][newPosition[1]];
      currentTiles[newPosition[0]][newPosition[1]] = temp;

      if (!silent) {
        // Atualize o estado das peças
        setTiles([...currentTiles]);
      }
    }
  };

  const findEmptyPosition = (currentTiles) => {
    // Encontre a posição do espaço vazio
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentTiles[i][j] === null) {
          return [i, j];
        }
      }
    }
  };

  const renderTile = (rowIndex, colIndex, value) => {
    return (
      <TouchableOpacity
        key={value}
        style={[styles.tile, { backgroundColor: value === null ? 'white' : 'lightblue' }]}
        onPress={() => moveTileToEmptySpace(rowIndex, colIndex)}
      >
        <Text style={styles.tileText}>{value}</Text>
      </TouchableOpacity>
    );
  };

  const moveTileToEmptySpace = (rowIndex, colIndex) => {
    // Mova a peça para o espaço vazio
    if (tiles[rowIndex][colIndex] !== null) {
      // Verifique se a peça pode ser movida para cima, baixo, esquerda ou direita do espaço vazio
      if (rowIndex + 1 < 3 && tiles[rowIndex + 1][colIndex] === null) {
        moveTile(0, tiles);
      } else if (rowIndex - 1 >= 0 && tiles[rowIndex - 1][colIndex] === null) {
        moveTile(1, tiles);
      } else if (colIndex + 1 < 3 && tiles[rowIndex][colIndex + 1] === null) {
        moveTile(2, tiles);
      } else if (colIndex - 1 >= 0 && tiles[rowIndex][colIndex - 1] === null) {
        moveTile(3, tiles);
      }
    }
  };

  const checkWin = () => {
    // Verifique se o jogador venceu
    if (JSON.stringify(tiles) === JSON.stringify(winningTiles)) {
      setGameWon(true);
      Alert.alert('Parabéns!', 'Você venceu o jogo!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {tiles.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((tile, colIndex) => renderTile(rowIndex, colIndex, tile))}
          </View>
        ))}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => moveTile(0, tiles)}>
          <Ionicons name="arrow-up-outline" size={15} color="black" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => moveTile(2, tiles)}>
            <Ionicons name="arrow-back-outline" size={15} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => moveTile(3, tiles)}>
            <Ionicons name="arrow-forward-outline" size={15} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => moveTile(1, tiles)}>
          <Ionicons name="arrow-down-outline" size={15} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C4146',
  },
  board: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  tileText: {
    fontSize: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
});

export default App;