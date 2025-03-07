// src/services/strapiService.ts
import axios from 'axios';

const API_URL = 'https://jwpqgsxvee.ap-northeast-1.awsapprunner.com/api';

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

// Helper function to get the full image URL
export const getStrapiImageUrl = (imageData: any) => {
  if (!imageData) return null;
  
  if (imageData.attributes && imageData.attributes.url) {
    // Check if it's already an absolute URL (S3)
    if (imageData.attributes.url.startsWith('http')) {
      return imageData.attributes.url;
    }
    return `https://jwpqgsxvee.ap-northeast-1.awsapprunner.com${imageData.attributes.url}`;
  } else if (typeof imageData === 'string') {
    if (imageData.startsWith('http')) {
      return imageData;
    }
    return `https://jwpqgsxvee.ap-northeast-1.awsapprunner.com${imageData}`;
  } else if (imageData.url) {
    if (imageData.url.startsWith('http')) {
      return imageData.url;
    }
    return `https://jwpqgsxvee.ap-northeast-1.awsapprunner.com${imageData.url}`;
  }
  
  return null;
};