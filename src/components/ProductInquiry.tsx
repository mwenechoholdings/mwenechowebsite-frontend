import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { submitInquiry } from '@/service/api';

interface ProductInquiryProps {
  productId: number;
  productName: string;
}

export default function ProductInquiry({ productId, productName }: ProductInquiryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await submitInquiry({
        type: 'product',
        product_id: productId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || null,
        message: formData.message,
      });

      toast.success('Inquiry sent! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error submitting inquiry:', error);
      toast.error(error?.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full sm:w-auto shadow-md"
      >
        <Send className="mr-2 h-4 w-4" />
        Ask a Question
      </Button>
    );
  }

  return (
    <Card className="mt-4 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Ask About {productName}</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xl leading-none text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="inquiry-name">Your Name *</Label>
            <Input
              id="inquiry-name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="inquiry-email">Email Address *</Label>
            <Input
              id="inquiry-email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="inquiry-phone">Phone (Optional)</Label>
            <Input
              id="inquiry-phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="inquiry-message">Your Question *</Label>
            <Textarea
              id="inquiry-message"
              placeholder="What would you like to know about this product?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Question
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
