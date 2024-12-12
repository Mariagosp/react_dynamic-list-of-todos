import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { getUser } from '../../api';

type Props = {
  onCloseModal: () => void;
  id: number;
  todos: Todo[];
};

export const TodoModal: React.FC<Props> = props => {
  const { id, onCloseModal, todos } = props;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const selected = todos.find(todo => todo.id === id);

  useEffect(() => {
    if (selected) {
      getUser(selected.userId)
        .then(person => {
          if (person.id === selected.userId) {
            setUser(person);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [selected]);

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />

      {loading ? (
        <Loader />
      ) : (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              {`Todo #${id}`}
            </div>

            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={onCloseModal}
            />
          </header>

          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {selected?.title}
            </p>

            <p className="block" data-cy="modal-user">
              {selected?.completed ? (
                <strong className="has-text-success">Done</strong>
              ) : (
                <strong className="has-text-danger">Planned</strong>
              )}

              {' by '}

              <a href={`mailto:${user?.email}`}>{user?.name}</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
