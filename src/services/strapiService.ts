// src/services/strapiService.ts
import axios from 'axios';

// Use environment variables or conditional logic for different environments
const API_URL = import.meta.env.PROD 
  ? 'https://jwpqgsxvee.ap-northeast-1.awsapprunner.com/api'
  : 'http://localhost:1337/api';

export const fetchBonsaiList = async () => {
  try {
    const response = await axios.get(`${API_URL}/bonsais`, {
      params: {
        'populate[0]': 'MainImage',
        'populate[1]': 'AdditionalImages'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching bonsai list:', error);
    throw error;
  }
};

export const fetchBonsaiById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/bonsais/${id}`, {
      params: {
        'populate[0]': 'MainImage',
        'populate[1]': 'AdditionalImages'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching bonsai with id ${id}:`, error);
    throw error;
  }
};

// Update the image URL helper function
export const getStrapiImageUrl = (imageData: any) => {
  if (!imageData) return null;
  
  const baseUrl = import.meta.env.PROD
    ? 'https://jwpqgsxvee.ap-northeast-1.awsapprunner.com'
    : 'http://localhost:1337';
  
  if (imageData.attributes && imageData.attributes.url) {
    if (imageData.attributes.url.startsWith('http')) {
      return imageData.attributes.url;
    }
    return `${baseUrl}${imageData.attributes.url}`;
  } else if (typeof imageData === 'string') {
    if (imageData.startsWith('http')) {
      return imageData;
    }
    return `${baseUrl}${imageData}`;
  } else if (imageData.url) {
    if (imageData.url.startsWith('http')) {
      return imageData.url;
    }
    return `${baseUrl}${imageData.url}`;
  }
  
  return null;
};