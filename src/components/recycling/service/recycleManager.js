import { showNotification } from '../../common/service/showNotification';

export const recycleManager = {
  getRecycleList: async function () {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_IP}/api/recycling/all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recycling list: ' + response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error('Network error:', error.message);
      throw new Error('Network error: Failed to fetch recycling list');
    }
  },
  createWTC: async function (formData, queryClient, dispatch) {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_IP}/api/recycling/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`
        },
        body: formData // Przesyłanie formData bez ustawiania 'Content-Type'
      });

      if (response.ok) {
        queryClient.invalidateQueries();
        showNotification('Waste transfer card created successfully.', 'success', dispatch);
      } else {
        const errorData = await response.text();
        console.error('Error:', errorData);
        showNotification(
          `Failed to create material waste trasfer card. Check console for more info.`,
          'error',
          dispatch
        );
      }
    } catch (error) {
      console.error('Network error:', error.message);
      showNotification(
        'Network error: Unable to create waste transfer card. Check console for more info.',
        'error',
        dispatch
      );
    }
  },
  deleteWTC: async function (id, queryClient, dispatch) {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_SERVER_IP}/api/recycling/delete/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      if (response.ok) {
        queryClient.invalidateQueries();
        showNotification('Waste transfer card deleted successfully.', 'info', dispatch);
      } else {
        const errorData = await response.text();
        console.error('Error:', errorData);
        showNotification(
          'Failed to delete waste transfer card. Check console for more info.',
          'error',
          dispatch
        );
      }
    } catch (error) {
      console.error('Network error:', error.message);
      showNotification(
        'Network error: Unable to delete waste transfer card. Check console for more info.',
        'error',
        dispatch
      );
    }
  },
  updateWTC: async function (formData, queryClient, dispatch) {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }

      const response = await fetch(`${process.env.REACT_APP_API_SERVER_IP}/api/recycling/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userToken}`
        },
        body: formData // Przesyłanie formData bez ustawiania 'Content-Type'
      });

      if (response.ok) {
        queryClient.invalidateQueries();
        showNotification('Waste transfer card updated successfully.', 'info', dispatch);
      } else {
        const errorText = await response.text();
        showNotification(
          `Failed to update waste transfer card: Check console for more info.`,
          'error',
          dispatch
        );
        console.error('Server Response:', response.status, errorText);
      }
    } catch (error) {
      console.error('Network error:', error.message);
      showNotification(
        'Network error: Unable to update waste transfer card. Check console for more info.',
        'error',
        dispatch
      );
    }
  },
  getRecycledMaterialsQuantity: async function () {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_SERVER_IP}/api/recycling/quantity`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recycled materials quantity: ' + response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error('Network error:', error.message);
      throw new Error('Network error: Failed to fetch recycled materials quantity');
    }
  },
  getRecyclingRefund: async function () {
    try {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_IP}/api/recycling/refund`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recycling refund: ' + response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error('Network error:', error.message);
      throw new Error('Network error: Failed to fetch recycling refund');
    }
  }
};
