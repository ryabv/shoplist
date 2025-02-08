import axios from 'axios';
import { Categories } from '../types';
// import dotenv from 'dotenv';

// import OpenAI from "openai";
// const openai = new OpenAI();
// const completion = await openai.chat.completions.create({
//     model: "gpt-4o",
//     store: true,
//     messages: [
//         {"role": "user", "content": "write a haiku about ai"}
//     ]
// });

// dotenv.config();
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Sends a shopping list to ChatGPT for categorization.
 * @param {string} shoppingList - Raw shopping list as text.
 * @returns {Promise<Object>} Categorized shopping list in JSON format.
 */
export async function categorizeShoppingList(
  shoppingList: string
): Promise<Categories> {
  try {
    // const response = await axios.post(
    //   'https://api.openai.com/v1/chat/completions',
    //   {
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //       {
    //         role: 'system',
    //         content: 'You are a helpful assistant that organizes shopping lists into categories such as "Bakery", "Meat", "Dairy", "Vegetables", etc. Return a JSON object.'
    //       },
    //       {
    //         role: 'user',
    //         content: `Organize the following shopping list into categories and if you see anything about amount, then log it separately:

    //         ${shoppingList}

    //         Return JSON in this format:
    //         [
    //           {
    //             id: 0918390821,
    //             title: 'Bakery'
    //             items: [
    //               { id: 47802374803, title: "Bread", amount: 1, unit: "piece"},
    //               { id: 98374678264, title: "Croissants"}
    //             ]
    //           },
    //           {
    //             id: 4083750847,
    //             title: 'Meat'
    //             items: [
    //               { id: 47802374803, title: "Chicken", amount: 1, unit: "kg"},
    //               { id: 98374678264, title: "Beef", amount: 1500, unit: "gram"}
    //             ]
    //           }
    //         ]`
    //       }
    //     ],
    //     temperature: 0.7,
    //   },
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${OPENAI_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );

    // return response.data.choices[0].message.content ? JSON.parse(response.data.choices[0].message.content) : {};

    return {
      categories: {
        dairy: { id: 'dairy', title: 'Dairy', items: ['item-1'] },
        meat: { id: 'meat', title: 'Meat', items: ['item-2'] },
        fruits: { id: 'fruits', title: 'Fruits', items: ['item-3', 'item-4'] },
      },
      items: {
        'item-1': { id: 'item-1', title: 'молоко', amount: 2, unit: 'пакета' },
        'item-2': { id: 'item-2', title: 'говядина', amount: 0.5, unit: 'кг' },
        'item-3': { id: 'item-3', title: 'яблоки', amount: 6, unit: 'шт' },
        'item-4': { id: 'item-4', title: 'груши', amount: 2, unit: 'шт' },
      },
      categoryOrder: ['dairy', 'meat', 'fruits'],
    };
  } catch (error) {
    console.error('Error categorizing shopping list:', error);
    return {};
  }
}
