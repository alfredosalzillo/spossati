import React from 'react';
import { useFilter, useSelect } from 'react-supabase';
import { Alert } from '@material-ui/lab';
import { Typography } from '@material-ui/core';

type ReviewSummary = {
  place_id: string,
  total_reviews: number,
  p_card_payment_accepted: number,
  p_contactless_payment_accepted: number,
};
const useReviewSummary = (placeId: string) => {
  const filter = useFilter<ReviewSummary>((query) => query
    .filter('place_id', 'eq', placeId), [placeId]);
  return useSelect('reviews_summary', {
    columns: '*',
    filter,
  });
};

type PlaceReviewsSummaryProps = {
  placeId: string,
};
const PlaceReviewsSummary: React.FunctionComponent<PlaceReviewsSummaryProps> = ({
  placeId,
}) => {
  const [{
    data = [],
    fetching,
  }] = useReviewSummary(placeId);
  if (fetching || !data) return <></>;
  const [stats] = data;
  if (!stats) {
    return (
      <Typography variant="body1" gutterBottom>
        No review yet for this structure. Be the first to leave a review!
      </Typography>
    );
  }
  const {
    total_reviews: totalReviews,
    p_card_payment_accepted: pCardPaymentAccepted,
  } = stats;
  if (pCardPaymentAccepted > 0.9) {
    return (
      <Alert severity="success" variant="filled">
        This structure accept card payments!
        <br />
        <Typography variant="caption">
          Based on
          {' '}
          {totalReviews}
          {' '}
          reviews.
        </Typography>
      </Alert>
    );
  }
  if (pCardPaymentAccepted > 0.5) {
    return (
      <Alert severity="warning" variant="filled">
        This structure seems to not always accept card payments.
        <br />
        <Typography variant="caption">
          Based on
          {' '}
          {totalReviews}
          {' '}
          reviews.
        </Typography>
      </Alert>
    );
  }
  return (
    <Alert severity="error" variant="filled">
      This structure seems to not accept card payments.
      <br />
      <Typography variant="caption">
        Based on
        {' '}
        {totalReviews}
        {' '}
        reviews.
      </Typography>
    </Alert>
  );
};

export default PlaceReviewsSummary;
