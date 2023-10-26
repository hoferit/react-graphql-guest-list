import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useMutation,
  useQuery,
} from '@apollo/client';
import { useEffect, useState } from 'react';
import styles from './App.module.scss';

const client = new ApolloClient({
  uri: 'http://localhost:5050/graphql', // Your GraphQL server URL
  cache: new InMemoryCache(),
});

const GET_GUESTS = gql`
  query GetGuests {
    guests {
      id
      firstName
      lastName
      attending
    }
  }
`;

const CREATE_GUEST = gql`
  mutation CreateGuestMutation($firstName: String!, $lastName: String!) {
    createGuestMutation(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
      attending
    }
  }
`;

const UPDATE_GUEST = gql`
  mutation UpdateGuestMutation($id: ID!, $attending: Boolean!) {
    updateGuestMutation(id: $id, attending: $attending) {
      id
      attending
    }
  }
`;

const DELETE_GUEST = gql`
  mutation DeleteGuestMutation($id: ID!) {
    deleteGuestMutation(id: $id)
  }
`;

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createGuestMutation] = useMutation(CREATE_GUEST);
  const [updateGuestMutation] = useMutation(UPDATE_GUEST);
  const [deleteGuestMutation] = useMutation(DELETE_GUEST);
  const { loading, error, data } = useQuery(GET_GUESTS);

  useEffect(() => {
    // Check for loading and error states, and update the local state if data is available.
    if (!loading && !error && data) {
      setGuests(data.guests);
      setIsLoading(false);
    }
  }, [loading, error, data]);

  async function createGuest() {
    try {
      const { data } = await createGuestMutation({
        variables: {
          firstName: firstName,
          lastName: lastName,
        },
      });

      // Update the local state with the newly created guest
      setGuests([...guests, data.createGuest]);

      // Clear the input fields
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.log(error);
    }
  }

  async function updateGuest(id) {
    try {
      const guestIndex = guests.findIndex((guest) => guest.id === id);
      const currentAttendingStatus = guests[guestIndex].attending;
      const { data } = await updateGuestMutation({
        variables: {
          id: id,
          attending: !currentAttendingStatus, // change attending status to opposite
        },
      });

      // Update the local state with the updated guest
      const updatedGuests = [...guests];
      updatedGuests[guestIndex] = {
        ...guests[guestIndex],
        attending: data.updateGuest.attending,
      };
      setGuests(updatedGuests);
    } catch (error) {
      console.log(error);
    }
  }

  // delete user with API
  async function deleteGuest(id) {
    try {
      const { data } = await deleteGuestMutation({
        variables: {
          id: id,
        },
      });

      // Update the local state by filtering out the deleted guest
      const newGuests = guests.filter((guest) => guest.id !== id);
      setGuests(newGuests);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  // const handleKeyPress = async (event) => {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     await createGuest();
  //     setFirstName('');
  //     setLastName('');
  //     await fetchGuests();
  //   }
  // };

  return (
    <ApolloProvider client={client}>
      <main className={styles.mainContainer}>
        <section>
          <h1>Guest List</h1>
          <form onSubmit={handleSubmit}>
            <label>
              First name
              <input
                value={firstName}
                placeholder="First name"
                disabled={isLoading}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </label>
            <label>
              Last name
              <input
                value={lastName}
                placeholder="Last name"
                disabled={isLoading}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
                onKeyUp={handleKeyPress}
              />
            </label>
          </form>
        </section>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <section>
            {guests.map((guest) => {
              return (
                <div
                  className={styles.listItem}
                  key={`guest-${guest.id}`}
                  data-test-id="guest"
                >
                  <div>
                    <input
                      aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                      type="checkbox"
                      checked={guest.attending}
                      onChange={() => {
                        updateGuest(guest.id, guest.attending).catch((error) =>
                          console.log(error),
                        );
                      }}
                    />
                    <span>
                      {guest.attending === true ? 'attending' : 'not attending'}
                    </span>
                  </div>
                  <p>
                    {guest.firstName} {guest.lastName}
                  </p>

                  <button
                    aria-label={`remove ${guest.firstName}${guest.lastName}`}
                    onClick={() => {
                      deleteGuest(guest.id).catch((error) =>
                        console.log(error),
                      );
                    }}
                    disabled={isLoading}
                  >
                    Remove guest
                  </button>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </ApolloProvider>
  );
}
