
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import AuthBackground from '@/components/AuthBackground';

// Bulgarian phone number regex
const bulgarianPhoneRegex = /^(\+359|0)?(87|88|89|98|99|42|43|48|49|35|37|39|52|53|54|55|56|57|58|59)\d{7}$/;

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resetPassword, setResetPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast({
        title: "Грешка",
        description: "Моля, попълнете всички задължителни полета",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number if provided
    if (phoneNumber && !bulgarianPhoneRegex.test(phoneNumber)) {
      toast({
        title: "Невалиден телефонен номер",
        description: "Моля, въведете валиден български телефонен номер",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber || null,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Успешна регистрация",
        description: "Проверете имейла си за потвърждение",
      });
      
    } catch (error: any) {
      toast({
        title: "Грешка при регистрация",
        description: error.message || "Възникна проблем при регистрацията",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Грешка",
        description: "Моля, попълнете всички полета",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Грешка при вход",
        description: error.message || "Невалиден имейл или парола",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Грешка",
        description: "Моля, въведете имейл адрес",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;
      
      toast({
        title: "Изпратен е имейл",
        description: "Проверете пощата си за линк за възстановяване на паролата",
      });
      
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при изпращането на имейла",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background p-4">
      <AuthBackground />
      
      <div className="w-full max-w-md z-10">
        <div className="mb-8 flex justify-center">
          <Logo className="scale-125" />
        </div>
        
        {resetPassword ? (
          <Card className="w-full backdrop-blur-sm bg-card/80 border border-border/50 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Забравена парола</CardTitle>
              <CardDescription className="text-center">
                Въведете имейла си, за да получите линк за възстановяване
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Имейл</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-spasi-red hover:bg-spasi-red/90"
                  disabled={loading}
                >
                  {loading ? "Изпращане..." : "Изпрати линк"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => setResetPassword(false)}
                className="text-foreground/70 hover:text-foreground"
              >
                Назад към вход
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="backdrop-blur-sm bg-card/80 border border-border/50 shadow-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Вход в системата</CardTitle>
                  <CardDescription>
                    Влезте в профила си с имейл и парола
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Имейл</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Парола</Label>
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={() => setResetPassword(true)}
                          className="text-xs text-foreground/70 hover:text-foreground p-0 h-auto"
                        >
                          Забравена парола?
                        </Button>
                      </div>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-spasi-red hover:bg-spasi-red/90"
                      disabled={loading}
                    >
                      {loading ? "Влизане..." : "Влез"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="backdrop-blur-sm bg-card/80 border border-border/50 shadow-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
                  <CardDescription>
                    Създайте нов профил в Spasi.bg
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Име</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Иван Иванов"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Имейл</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Парола</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Телефонен номер (по желание)</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+359887123456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-background/50"
                        pattern="^(\+359|0)?(87|88|89|98|99|42|43|48|49|35|37|39|52|53|54|55|56|57|58|59)\d{7}$"
                      />
                      <p className="text-xs text-muted-foreground">
                        Форматът трябва да бъде +359887123456 или 0887123456
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-spasi-green hover:bg-spasi-green/90"
                      disabled={loading}
                    >
                      {loading ? "Регистриране..." : "Регистрирай се"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Auth;
