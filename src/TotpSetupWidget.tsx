import React, { useState } from 'react';
import { Button, TextInput, Tile, InlineNotification } from '@carbon/react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/totp';

const TotpSetupWidget: React.FC = () => {
    const [secret, setSecret] = useState<string>('');
    const [qrCodeUri, setQrCodeUri] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' | null }>({
        message: '',
        type: null,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleSetup = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/setup`);
            setSecret(response.data.secret);
            setQrCodeUri(response.data.qrCodeUri);
            setStatus({ message: 'Secret generated! Scan the QR code below.', type: 'info' });
        } catch (error) {
            setStatus({ message: 'Failed to initiate TOTP setup.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!code) {
            setStatus({ message: 'Please enter the 6-digit code.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/verify`, { code, secret });
            if (response.data.success) {
                setStatus({ message: 'Success: 2FA Enabled!', type: 'success' });
            } else {
                setStatus({ message: 'Invalid code. Please try again.', type: 'error' });
            }
        } catch (error) {
            setStatus({ message: 'Error during verification.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tile id="totp-setup-widget" style={{ maxWidth: '450px', margin: '2rem auto', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>TOTP Multi-Factor Authentication</h2>

            {status.type && (
                <InlineNotification
                    kind={status.type === 'info' ? 'info' : status.type}
                    title={status.type === 'success' ? 'Success' : 'Status'}
                    subtitle={status.message}
                    style={{ marginBottom: '1.5rem' }}
                />
            )}

            {!qrCodeUri ? (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Protect your account by adding an extra layer of security with TOTP-based Two-Factor Authentication.
                    </p>
                    <Button onClick={handleSetup} disabled={loading}>
                        {loading ? 'Initializing...' : 'Enable Two-Factor Authentication'}
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <img src={qrCodeUri} alt="TOTP QR Code" style={{ display: 'block', width: '200px', height: '200px' }} />
                    </div>
                    
                    <p style={{ fontSize: '0.85rem', color: '#666', background: '#f4f4f4', padding: '8px', borderRadius: '4px', width: '100%', textAlign: 'center' }}>
                        <strong>Secret Key:</strong> {secret}
                    </p>

                    <TextInput
                        id="totp-code-input"
                        labelText="Verification Code"
                        helperText="Enter the 6-digit code from your authenticator app."
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                    />

                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <Button 
                            kind="primary" 
                            onClick={handleVerify} 
                            disabled={loading || status.type === 'success'}
                            style={{ flex: 1 }}
                        >
                            {loading ? 'Verifying...' : 'Verify & Enable'}
                        </Button>
                        <Button 
                            kind="ghost" 
                            onClick={() => { setQrCodeUri(''); setSecret(''); setCode(''); setStatus({ message: '', type: null }); }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </Tile>
    );
};

export default TotpSetupWidget;
