import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { IAzureGraphService } from './interfaces';
import { graphRequest } from '../../config/authConfig';
import { IUserProfile } from '../model';

export class AzureGraphServiceImplementation implements IAzureGraphService {
    async getAccessToken(instance: any, account: any, scopes: string[] = ['User.Read']): Promise<string> {
        const request = {
            scopes,
            account,
        };

        try {
            const response = await instance.acquireTokenSilent(request);
            return response.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                try {
                    await instance.acquireTokenRedirect(request);
                    throw new Error('Redirecting for authentication');
                } catch (redirectError) {
                    console.error('Token acquisition redirect failed:', redirectError);
                    throw redirectError;
                }
            }
            throw error;
        }
    }

    async getUserPhoto(accessToken: string, userId: string, abortSignal?: AbortSignal): Promise<string | null> {
        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/users/${userId}/photo/$value`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                signal: abortSignal
            });
            
            if (response.ok) {
                const photoBlob = await response.blob();
                return URL.createObjectURL(photoBlob);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async getUserProfile(
        instance: any, 
        account: any, 
        abortSignal?: AbortSignal
    ): Promise<{ profile: any; photo: string | null }> {
        try {
            const accessToken = await this.getAccessToken(instance, account, graphRequest.scopes);

            const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                signal: abortSignal
            });
            
            if (!profileResponse.ok) {
                throw new Error(`Failed to fetch user profile: ${profileResponse.statusText}`);
            }

            const profile = await profileResponse.json();
            
            const photo = await this.getUserPhoto(accessToken, profile.id, abortSignal);

            return {
                profile,
                photo
            };
        } catch (error) {
            console.error('Error fetching user data from Microsoft Graph:', error);
            throw error;
        }
    }

    async getAllUsers(instance: any, account: any, abortSignal?: AbortSignal): Promise<IUserProfile[]> {
        try {
            const accessToken = await this.getAccessToken(instance, account, ['User.ReadBasic.All']);

            let users: IUserProfile[] = [];
            let nextLink: string | null = 'https://graph.microsoft.com/v1.0/users?$select=displayName,mail,id';

            while (nextLink) {
                const response = await fetch(nextLink, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'ConsistencyLevel': 'eventual',
                    },
                    signal: abortSignal,
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch users: ${response.statusText}`);
                }

                const data = await response.json();
                const userPromises = data.value.map(async (user: any) => {
                    const photoUrl = await this.getUserPhoto(accessToken, user.id, abortSignal);
                    return {
                        id: user.id,
                        name: user.displayName || 'No name',
                        email: user.mail || user.userPrincipalName || null,
                        photoUrl,
                    };
                });

                users = users.concat(await Promise.all(userPromises));
                nextLink = data['@odata.nextLink'] || null;
            }

            return users;
        } catch (error) {
            return [];
        }
    }
}