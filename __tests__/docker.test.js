const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Docker Configuration', () => {
  const dockerComposePath = path.join(__dirname, '../docker-compose.yml');
  const dockerfilePath = path.join(__dirname, '../Dockerfile');
  const envExamplePath = path.join(__dirname, '../.env.example');
  
  test('docker-compose.yml file should exist', () => {
    expect(fs.existsSync(dockerComposePath)).toBe(true);
  });

  test('Dockerfile should exist', () => {
    expect(fs.existsSync(dockerfilePath)).toBe(true);
  });

  test('docker-compose.yml should have correct structure', () => {
    const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');
    
    // Check for required services
    expect(dockerComposeContent).toContain('services:');
    expect(dockerComposeContent).toContain('app:');
    
    // Check for build configuration
    expect(dockerComposeContent).toContain('build:');
    expect(dockerComposeContent).toContain('context: .');
    expect(dockerComposeContent).toContain('dockerfile: Dockerfile');
    
    // Check for port mapping
    expect(dockerComposeContent).toContain('"3000:3000"');
    
    // Check for healthcheck
    expect(dockerComposeContent).toContain('healthcheck:');
    expect(dockerComposeContent).toContain('test:');
  });

  test('Dockerfile should have multi-stage build', () => {
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
    
    // Check for builder stage
    expect(dockerfileContent).toMatch(/FROM.*AS builder/);
    
    // Check for runner stage
    expect(dockerfileContent).toMatch(/FROM.*AS runner/);
    
    // Check for Node.js usage
    expect(dockerfileContent).toMatch(/node:/);
    
    // Check for build commands
    expect(dockerfileContent).toMatch(/npm ci/);
    expect(dockerfileContent).toMatch(/npm run build/);
    
    // Check for production setup
    expect(dockerfileContent).toMatch(/NODE_ENV=production/);
    expect(dockerfileContent).toMatch(/npm start/);
  });

  test('Dockerfile should expose correct port', () => {
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
    expect(dockerfileContent).toMatch(/EXPOSE 3000/);
  });

  test('.env.example should exist and contain required variables', () => {
    expect(fs.existsSync(envExamplePath)).toBe(true);
    
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // Check for CMS configuration
    expect(envContent).toMatch(/CMS_PROVIDER/);
    expect(envContent).toMatch(/NEXT_PUBLIC_SANITY_PROJECT_ID/);
    expect(envContent).toMatch(/NEXT_PUBLIC_SANITY_DATASET/);
    
    // Check for site configuration
    expect(envContent).toMatch(/SITE_URL/);
    
    // Should not contain actual secrets
    expect(envContent).not.toMatch(/your_actual_project_id/);
    expect(envContent).not.toMatch(/real_secret_token/);
  });

  test('docker-compose should use env_file', () => {
    const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');
    expect(dockerComposeContent).toMatch(/env_file:/);
    expect(dockerComposeContent).toMatch(/\.env\.local/);
  });

  test('Dockerfile should copy necessary files', () => {
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
    
    expect(dockerfileContent).toMatch(/COPY.*package\.json/);
    expect(dockerfileContent).toMatch(/COPY.*\..next/);
    expect(dockerfileContent).toMatch(/COPY.*public/);
  });
});