import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'TEXT';
const BoxItemType = 'BOX_ITEM';

const DraggableText = ({ id, text, onDelete }) => {
  const [, ref] = useDrag(() => ({
    type: ItemType,
    item: { id, text },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDelete(id);
      }
    },
  }), [id, onDelete]);

  return (
    <div ref={ref} style={{ padding: '8px', border: '1px solid black', marginBottom: '4px', backgroundColor: 'lightgray' }}>
      {text}
    </div>
  );
};

const BoxItem = ({ item, index, moveItem }) => {
  const [, ref] = useDrag(() => ({
    type: BoxItemType,
    item: { index },
  }), [index]);

  const [, drop] = useDrop(() => ({
    accept: BoxItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }));

  return (
    <div ref={node => ref(drop(node))}>
      {item.text}
    </div>
  );
};

const DroppableBox = () => {
  const [droppedItems, setDroppedItems] = useState([]);
  const [, ref] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => {
      setDroppedItems([...droppedItems, item]);
      return { item };
    },
  }), [droppedItems]);

  const moveItem = (fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= droppedItems.length || toIndex >= droppedItems.length) {
      return; // out of bounds
    }
    const updatedItems = [...droppedItems];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setDroppedItems(updatedItems);
  };
  

  return (
    <div ref={ref} style={{ width: '200px', height: '200px', border: '1px solid blue', backgroundColor: 'lightblue' }}>
      Kotak Drop
      {droppedItems.map((item, index) => (
        <BoxItem key={index} index={index} item={item} moveItem={moveItem} />
      ))}
    </div>
  );
};

const DNDtest = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Text 1' },
    { id: 2, text: 'Text 2' },
    { id: 3, text: 'Text 3' },
  ]);

  const onDelete = (id) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ margin: '32px' }}>
          <h4>Text yang dapat diseret:</h4>
          {items.map(item => (
            <DraggableText key={item.id} id={item.id} text={item.text} onDelete={onDelete} />
          ))}
        </div>
        <div style={{ margin: '32px' }}>
          <h4>Seret teks ke kotak ini:</h4>
          <DroppableBox />
        </div>
      </div>
    </DndProvider>
  );
};

export default DNDtest;
