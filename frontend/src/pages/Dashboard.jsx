import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Heading, Text } from '../components/ui';

export default function Dashboard() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-800) 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container size="lg" padding="lg">
        <Card variant="elevated" padding="xl" style={{ textAlign: 'center', maxWidth: '50rem', margin: '0 auto' }}>
          <Heading 
            level={1} 
            size="4xl" 
            align="center"
            icon="sparkles"
            style={{ marginBottom: 'var(--space-6)' }}
          >
            Welcome to the Parallel Lives Playground
          </Heading>
          <Text 
            size="xl" 
            align="center"
            style={{ margin: 0, color: 'var(--color-primary-700)' }}
          >
            Create timelines, spawn parallel realities, visit your friends' lives, and watch how different choices change outcomes.
          </Text>
        </Card>
      </Container>
    </div>
  );
}
