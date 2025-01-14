import { useState, useEffect } from 'react';
import { User, Activity } from '../types/user';

interface UseUsersResult {
  users: User[] | null;
  activities: Activity[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[] | null>(null);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Replace with actual API calls
        const usersResponse = await fetch('/api/users');
        const activitiesResponse = await fetch('/api/activities');

        if (!usersResponse.ok || !activitiesResponse.ok) {
          throw new Error('Error fetching data');
        }

        const usersData = await usersResponse.json();
        const activitiesData = await activitiesResponse.json();

        setUsers(usersData);
        setActivities(activitiesData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { users, activities, isLoading, error };
}