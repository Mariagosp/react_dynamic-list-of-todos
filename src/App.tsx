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
import { Filters } from './types/Filters';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [status, setStatus] = useState<string>('all');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const [loadingTodos, setLoadingTodos] = useState(true);

  const filteredTodos = todos
    .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()))
    .filter(todo => {
      if (status === Filters.ALL) {
        return true;
      }

      return status === Filters.COMPLETED ? todo.completed : !todo.completed;
    });

  const selected = todos.find(todo => todo.id === selectedTodoId);

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const onReset = () => {
    setQuery('');
  };

  const onOpenModal = (todo: Todo) => {
    setSelectedTodoId(todo.id);
  };

  const onCloseModal = () => {
    setSelectedTodoId(null);
  };

  const onStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value as Filters);
  };

  useEffect(() => {
    setLoadingTodos(true);

    getTodos()
      .then(data => {
        setTodos(data);
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
                  selectedTodoId={selectedTodoId}
                  onOpenModal={onOpenModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedTodoId && selected && (
        <TodoModal todo={selected} onCloseModal={onCloseModal} />
      )}
    </>
  );
};
