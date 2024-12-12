/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos, getUser } from './api';
import { User } from './types/User';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [query, setQuery] = useState<string>('');
  const [status, setStatus] = useState<string>('all'); // all, active, completed
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [loadingTodos, setLoadingTodos] = useState(false);

  const filterTodos = () => {
    setFilteredTodos(
      todos
        .filter(todo => {
          if (status === 'active') {
            return !todo.completed;
          }

          if (status === 'completed') {
            return todo.completed;
          }

          return true;
        })
        .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase())),
    );
  };

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const onReset = () => {
    setQuery('');
    setFilteredTodos(todos);
  };

  const onStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const onOpenModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setLoadingTodos(true);

    getUser(todo.userId)
      .then(setUser)
      .finally(() => setLoadingTodos(false));
  };

  const onCloseModal = () => {
    setSelectedTodo(null);
    setUser(null);
  };

  useEffect(() => {
    filterTodos();
  }, [todos, query, status]);

  useEffect(() => {
    setLoadingTodos(true);

    getTodos()
      .then(data => {
        setTodos(data);
        setFilteredTodos(data);
      })
      .finally(() => setLoadingTodos(false));
  }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                query={query}
                onQueryChange={onQueryChange}
                onReset={onReset}
                onStatusChange={onStatusChange}
              />
            </div>

            <div className="block">
              {loadingTodos && todos.length === 0 && <Loader />}
              {!loadingTodos && (
                <TodoList
                  todos={filteredTodos}
                  selectedTodo={selectedTodo}
                  onOpenModal={onOpenModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedTodo && user && (
        <TodoModal
          user={user}
          selectedTodo={selectedTodo}
          onCloseModal={onCloseModal}
          loadingTodos={loadingTodos}
        />
      )}
    </>
  );
};
