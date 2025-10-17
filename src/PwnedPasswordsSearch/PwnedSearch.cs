using System;
using System.Globalization;
using System.IO;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PwnedPasswordsSearch;
// Based on https://github.com/mikepound/pwned-search/blob/master/csharp/pwned-search.cs

public static class PwnedSearch
{
    /// <summary>
    /// Makes a call to Pwned Passwords API, asking for a set of hashes of publicly known passwords that match a partial hash of a given password.
    /// If any of the hashes returned by the API call fully matches the hash of the plaintext, it would mean that the password has been exposed
    /// in publicly known data breaches and thus is not safe to use.
    /// See https://haveibeenpwned.com/API/v2#PwnedPasswords
    /// </summary>
    /// <param name="plaintext">Password to check against Pwned Passwords API</param>
    /// <returns>True when the password has been Pwned</returns>
    public static async Task<bool> IsPwnedPasswordAsync(string plaintext)
    {
        if (string.IsNullOrEmpty(plaintext))
            return false;

        try
        {
            // Use modern SHA1.HashData() instead of ComputeHash for better performance
            byte[] data = SHA1.HashData(Encoding.UTF8.GetBytes(plaintext));

            // Loop through each byte of the hashed data and format each one as a hexadecimal string.
            var sBuilder = new StringBuilder();
            foreach (var t in data)
                sBuilder.Append(t.ToString("x2", CultureInfo.InvariantCulture));

            var result = sBuilder.ToString().ToUpperInvariant();

            // Get a list of all the possible password hashes where the first 5 bytes of the hash are the same
            var url = $"https://api.pwnedpasswords.com/range/{result[..5]}";

            // Use modern HttpClient instead of obsolete WebRequest
            using var httpClient = new HttpClient();
            using var response = await httpClient.GetStreamAsync(new Uri(url));
            using var reader = new StreamReader(response);

            // Iterate through all possible matches and compare the rest of the hash to see if there is a full match
            string hashToCheck = result[5..];
            string? line;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                string[] parts = line.Split(':');
                if (parts.Length >= 2 && parts[0] == hashToCheck) // This is a full match: plaintext compromised!!!!
                {
                    System.Diagnostics.Debug.Print($"The password '{plaintext}' is publicly known and can be used in dictionary attacks");
                    return true;
                }
            }

            // We've run through all the candidates and none of them is a full match
            return false; // This plaintext is not publicly known
        }
        catch (HttpRequestException)
        {
            // Network-related exceptions - safer to assume password is not pwned
            return false;
        }
        catch (TaskCanceledException)
        {
            // Timeout exceptions - safer to assume password is not pwned
            return false;
        }
        catch (Exception)
        {
            // If any weird things happens, it is safer to suppose this plaintext is compromised (hence not to be used).
            return true; // Better safe than sorry.
        }
    }

    /// <summary>
    /// Synchronous wrapper for IsPwnedPasswordAsync for backward compatibility
    /// </summary>
    /// <param name="plaintext">Password to check against Pwned Passwords API</param>
    /// <returns>True when the password has been Pwned</returns>
    public static bool IsPwnedPassword(string plaintext)
    {
        return IsPwnedPasswordAsync(plaintext).GetAwaiter().GetResult();
    }
}