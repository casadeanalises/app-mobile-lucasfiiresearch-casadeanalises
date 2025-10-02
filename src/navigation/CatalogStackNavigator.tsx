import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CatalogScreen from '../screens/CatalogScreen';
import InvestmentThesisScreen from '../screens/investment-thesis/InvestmentThesisScreen';
import WeeklyReportsScreen from '../screens/weekly-reports/WeeklyReportsScreen';
import EtfReportsScreen from '../screens/etf-reports/EtfReportsScreen';

export type CatalogStackParamList = {
  CatalogHome: undefined;
  InvestmentThesis: undefined;
  WeeklyReports: undefined;
  EtfReports: undefined;
};

const Stack = createStackNavigator<CatalogStackParamList>();

const CatalogStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CatalogHome" component={CatalogScreen} />
      <Stack.Screen 
        name="InvestmentThesis" 
        component={InvestmentThesisScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
             <Stack.Screen 
               name="WeeklyReports" 
               component={WeeklyReportsScreen}
               options={{
                 animation: 'slide_from_right',
               }}
             />
        <Stack.Screen
          name="EtfReports"
          component={EtfReportsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    );
  };

export default CatalogStackNavigator;
