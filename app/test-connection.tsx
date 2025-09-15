import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';

export default function TestConnectionScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectFetch = async () => {
    addResult('🔄 Testing direct fetch to API...');
    try {
      const response = await fetch('https://greetings-project-scb4vi6.rork.com/api');
      const data = await response.json();
      addResult(`✅ Direct API fetch success: ${JSON.stringify(data)}`);
    } catch (error) {
      addResult(`❌ Direct API fetch failed: ${error}`);
    }
  };

  const testTrpcEndpoint = async () => {
    addResult('🔄 Testing tRPC endpoint...');
    try {
      const response = await fetch('https://greetings-project-scb4vi6.rork.com/api/trpc/tournaments.list');
      addResult(`📡 tRPC endpoint response status: ${response.status}`);
      const text = await response.text();
      addResult(`📄 tRPC endpoint response: ${text.substring(0, 200)}...`);
    } catch (error) {
      addResult(`❌ tRPC endpoint test failed: ${error}`);
    }
  };

  // Test tournament query
  const tournamentsQuery = trpc.tournaments.list.useQuery(
    { status: 'all' as const, limit: 5 },
    {
      enabled: false // Don't auto-run
    }
  );
  
  // Handle query results with useEffect
  React.useEffect(() => {
    if (tournamentsQuery.data) {
      addResult(`✅ tRPC query success: ${tournamentsQuery.data.tournaments.length} tournaments`);
    }
    if (tournamentsQuery.error) {
      addResult(`❌ tRPC query error: ${tournamentsQuery.error.message}`);
    }
  }, [tournamentsQuery.data, tournamentsQuery.error]);

  const runTrpcQuery = () => {
    addResult('🔄 Running tRPC tournament query...');
    tournamentsQuery.refetch();
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔧 Connection Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testDirectFetch}>
          <Text style={styles.buttonText}>Test Direct API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testTrpcEndpoint}>
          <Text style={styles.buttonText}>Test tRPC Endpoint</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={runTrpcQuery}>
          <Text style={styles.buttonText}>Test tRPC Query</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearResults}>
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
        
        {tournamentsQuery.isLoading && (
          <Text style={styles.loadingText}>🔄 Loading...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  loadingText: {
    fontSize: 14,
    color: '#007AFF',
    fontStyle: 'italic',
  },
});