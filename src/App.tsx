/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [query, setQuery] = useState<string>('');
  const [status, setStatus] = useState<string>('all');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

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
  };

  const onCloseModal = () => {
    setSelectedTodo(null);
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
      {selectedTodo && (
        <TodoModal
          id={selectedTodo.id}
          todos={todos}
          onCloseModal={onCloseModal}
        />
      )}
    </>
  );
};
