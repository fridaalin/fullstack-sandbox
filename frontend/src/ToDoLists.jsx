import React, { Fragment, useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ReceiptIcon from '@material-ui/icons/Receipt'
import Typography from '@material-ui/core/Typography'
import { ToDoListForm } from './ToDoListForm'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getPersonalTodos = () => {
  return sleep(1000).then(() => Promise.resolve({
    '0000000001': {
      id: '0000000001',
      title: 'First List',
      todos: ['First todo of first list!']
    },
    '0000000002': {
      id: '0000000002',
      title: 'Second List',
      todos: ['First todo of second list!']
    }
  }))
}

export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    const data = localStorage.getItem('updatedList');
    if (data) {
      setToDoLists(JSON.parse(data));
    }
    else
      getPersonalTodos()
      .then(setToDoLists)
  }, []);

  useEffect(() => {
    localStorage.setItem('updatedList', JSON.stringify(toDoLists));
  });

  if (!Object.keys(toDoLists).length) return null
  return <Fragment>
    <Card style={style}>
      <CardContent>
        <Typography
          component='h2'
        >
          My ToDo Lists
        </Typography>
        <List>
          {Object.keys(toDoLists).map((key) => <ListItem
            key={key}
            button
            onClick={() => setActiveList(key)}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={toDoLists[key].title} />
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {toDoLists[activeList] && <ToDoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      toDoList={toDoLists[activeList]}
      saveToDoList={(id, { todos }) => {
        const listToUpdate = toDoLists[id]
        setToDoLists({
          ...toDoLists,
          [id]: { ...listToUpdate, todos }
        })
      }}
    />}
  </Fragment>
}
