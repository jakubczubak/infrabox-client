import { showNotification } from '../../common/service/showNotification';

export const projectListManager = {
  getProjects: async function () {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_IP}/api/project/get`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects: ' + response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error('Network error:', error.message);
      throw new Error('Network error: Unable to fetch projects');
    }
  },
  getProjectItemByID: async function (id) {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_IP}/api/project/get/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project item: ' + response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error('Network error:', error.message);
      throw new Error('Network error: Unable to fetch project item');
    }
  },
  createProject: async function (data, queryClient, dispatch) {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_IP}/api/project/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        queryClient.invalidateQueries();
        showNotification('Project created successfully.', 'success', dispatch);
      } else {
        const errorData = await response.text();
        console.error('Error:', errorData);
        showNotification(
          `Failed to create project. Check console for more info.`,
          'error',
          dispatch
        );
      }
    } catch (error) {
      console.error('Network error:', error.message);
      showNotification(
        'Network error: Unable to create project. Check console for more info.',
        'error',
        dispatch
      );
    }
  },
  updateProject: async function (data, queryClient, dispatch) {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_IP}/api/project/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        queryClient.invalidateQueries();
        showNotification('Project updated successfully.', 'success', dispatch);
      } else {
        const errorData = await response.text();
        console.error('Error:', errorData);
        showNotification(
          `Failed to update project. Check console for more info.`,
          'error',
          dispatch
        );
      }
    } catch (error) {
      console.error('Network error:', error.message);
      showNotification(
        'Network error: Unable to update project. Check console for more info.',
        'error',
        dispatch
      );
    }
  },
  deleteProject: async function (id, queryClient, dispatch) {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_SERVER_IP}/api/project/delete/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      if (response.ok) {
        queryClient.invalidateQueries();
        showNotification('Project deleted successfully.', 'success', dispatch);
      } else {
        const errorData = await response.text();
        console.error('Error:', errorData);
        showNotification(
          `Failed to delete project. Check console for more info.`,
          'error',
          dispatch
        );
      }
    } catch (error) {
      console.error('Network error:', error.message);
      showNotification(
        'Network error: Unable to delete project. Check console for more info.',
        'error',
        dispatch
      );
    }
  }
};
